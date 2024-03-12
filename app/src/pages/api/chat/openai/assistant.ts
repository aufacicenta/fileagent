import { NextApiRequest, NextApiResponse } from "next";
import { Thread } from "openai/resources/beta/threads/threads";
import { MessageContentText } from "openai/resources/beta/threads/messages/messages";

import logger from "providers/logger";
import openai from "providers/openai";
import { ChatLabel } from "context/message/MessageContext.types";
import { FileAgentRequest } from "../types";
import json from "providers/json";
import chat from "providers/chat";
import { ChatCompletionChoice } from "providers/chat/chat.types";
import sequelize from "providers/sequelize";

export default async function Fn(request: NextApiRequest, response: NextApiResponse) {
  try {
    logger.info(`calling chat assitant from ID asst_Ukvy8hXlI6s0uR36XLQO3vrN`);

    const data: FileAgentRequest = (() => {
      if (request.body?.currentMessageMetadata?.source === "messagebird") {
        return request.body;
      }

      if (typeof request.body.body === "string") {
        return JSON.parse(request.body.body, json.reviver);
      }

      return request.body.body;
    })();

    const { UserSession } = await sequelize.load();

    let userSession;

    if (data.currentMessageMetadata?.messagebird?.participantId) {
      userSession = await UserSession.findOne({
        where: {
          messagebird_participant_id: data.currentMessageMetadata?.messagebird?.participantId,
        },
      });
    } else if (data.currentMessageMetadata?.openai?.threadId) {
      userSession = await UserSession.findOne({
        where: {
          openai_thread_id: data.currentMessageMetadata?.openai?.threadId,
        },
      });
    } else {
      userSession = UserSession.build();
    }

    let thread: Thread;

    if (!userSession?.openai_thread_id) {
      thread = await openai.client.beta.threads.create();

      userSession?.set("openai_thread_id", thread.id);

      if (data.currentMessageMetadata?.messagebird?.participantId) {
        userSession?.set("messagebird_participant_id", data.currentMessageMetadata?.messagebird?.participantId);
      }

      await userSession?.save();
    } else {
      thread = await openai.client.beta.threads.retrieve(userSession.openai_thread_id);
    }

    await openai.client.beta.threads.messages.create(thread.id, {
      role: "user",
      content: data.currentMessage.content as string,
    });

    const assistant = await openai.client.beta.assistants.retrieve("asst_Ukvy8hXlI6s0uR36XLQO3vrN");

    const run = await openai.client.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
      // TODO pass the data that's already been collected
      instructions: `Eres un asistente que pide información básica para crear una base de datos de proveedores.

Esta es la información que debes consultar y recolectar una por una (IMPORTANTE que sea una por una) para no abrumar al proveedor:

Nombre y apellido
Número de Whatsapp
Dirección (insiste amablemente hasta que tengas todos estos datos: país "country", ciudad "city", código postal "zip_code", calle y número "address_1", cómo llegar "address_2")
NIT (Número de Identificación Tributaria)
Categoría (puede ser una de estas: carpintería, plomería, electricista, albañil, ferretería, materiales de construcción, repuestos para carros, carros usados)

Esta es la información que ya tienes:

Nombre y apellido:
Número de Whatsapp:
Dirección:
NIT (Número de Facturación):
Categoría:

`,
    });

    const runStatusCompleted = () =>
      new Promise((resolve) => {
        const interval = setInterval(async () => {
          const currentRun = await openai.client.beta.threads.runs.retrieve(thread.id, run.id);

          // TODO data gets inserted multiple times, we need to wait somehow
          if (currentRun.status === "requires_action") {
            const requiredActions = currentRun.required_action?.submit_tool_outputs.tool_calls;

            logger.info(`requiredActions: ${JSON.stringify(requiredActions)}`);

            await chat.processFunctionToolCalls(requiredActions!, data, request, thread, run);
          }

          if (currentRun.status === "completed") {
            clearInterval(interval);

            resolve(currentRun);
          }
        }, 1000);
      });

    await runStatusCompleted();

    const messages = await openai.client.beta.threads.messages.list(thread.id);

    response.status(200).json({
      choices: [
        {
          message: {
            role: "assistant",
            content: (messages.data[0].content[0] as MessageContentText).text.value,
            label: ChatLabel.chat_completion_success,
            type: "text",
            metadata: {
              openai: {
                threadId: thread.id,
              },
            },
          },
        },
      ],
    } as { choices: ChatCompletionChoice[] });
  } catch (error) {
    logger.error(error);

    response.status(200).json({
      error: (error as Error).message,
      choices: [
        {
          message: {
            role: "assistant",
            content: "Apologies, I couldn't resolve this request. Try again.",
            label: ChatLabel.chat_completion_error,
            readOnly: true,
            type: "text",
          },
        },
      ],
    });
  }
}
