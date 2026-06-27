import { forwardRef, type ReactNode } from "react";

type SnapSectionProps = {
  id?: string;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
};

export const SnapSection = forwardRef<HTMLElement, SnapSectionProps>(
  function SnapSection(
    { id, className = "", contentClassName = "", children },
    ref,
  ) {
    return (
      <section
        ref={ref}
        id={id}
        data-snap-section
        className={`flex h-dvh flex-col items-center justify-center px-6 md:px-10 ${className}`}
      >
        <div
          data-section-content
          className={`flex flex-col items-center text-center ${contentClassName}`}
        >
          {children}
        </div>
      </section>
    );
  },
);
