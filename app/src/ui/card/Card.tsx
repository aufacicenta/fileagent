import clsx from "clsx";
import React, { MouseEvent, useRef, useState } from "react";

import styles from "./Card.module.scss";
import { CardActionsProps, CardContentProps, CardProps } from "./Card.types";

export const Card: React.FC<CardProps> & {
  Content: React.FC<CardContentProps>;
  Actions: React.FC<CardActionsProps>;
} = ({ children, className, backgroundImageUrl, url, shadow, withSpotlightEffect, ...props }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: MouseEvent) => {
    if (!divRef.current || isFocused) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={clsx(styles.card, className, {
        [styles.card__link]: !!url || !!props.onClick,
        [styles.card__shadow]: !!shadow,
        [styles.card__spotlight]: !!withSpotlightEffect,
      })}
      {...props}
    >
      {withSpotlightEffect && (
        <div
          className={styles["card__spotlight--child"]}
          style={{
            opacity,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,.06), transparent 40%)`,
          }}
        />
      )}
      {backgroundImageUrl && (
        <div
          className={clsx(
            {
              [styles["card__background-image"]]: !!backgroundImageUrl,
            },
            "card__background-image",
          )}
          style={{ backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : undefined }}
        />
      )}
      {children}
    </div>
  );
};

const Content: React.FC<CardContentProps> = ({ children, className }) => (
  <div className={clsx(styles.card__content, className)}>{children}</div>
);

const Actions: React.FC<CardActionsProps> = ({ children, className }) => (
  <div className={clsx(styles.card__actions, className)}>{children}</div>
);

Card.Content = Content;
Card.Actions = Actions;
