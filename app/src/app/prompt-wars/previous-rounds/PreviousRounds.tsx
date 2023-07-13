import clsx from "clsx";

import { PreviousRoundsTable } from "ui/pulse/prompt-wars/previous-rounds-table/PreviousRoundsTable";
import { MainPanel } from "ui/mainpanel/MainPanel";
import { Card } from "ui/card/Card";
import { Footer } from "ui/footer/Footer";

import { PreviousRoundsProps } from "./PreviousRounds.types";
import styles from "./PreviousRounds.module.scss";

export const PreviousRounds: React.FC<PreviousRoundsProps> = ({ className, markets }) => (
  <>
    <MainPanel.Container className={clsx(styles["previous-rounds"], className)} paddingX>
      <Card>
        <Card.Content>
          <PreviousRoundsTable markets={markets} />
        </Card.Content>
      </Card>
    </MainPanel.Container>

    <Footer />
  </>
);
