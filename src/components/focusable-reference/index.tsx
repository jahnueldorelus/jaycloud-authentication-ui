import { ForwardedRef, forwardRef } from "react";

export const FocusableReference = forwardRef(
  (_props, ref: ForwardedRef<HTMLDivElement>) => {
    return (
      <div
        className="visually-hidden"
        ref={ref}
        tabIndex={-1}
        style={{ transform: `translateX(-110vw)` }}
      />
    );
  }
);
