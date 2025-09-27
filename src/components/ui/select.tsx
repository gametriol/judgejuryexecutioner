// src/components/ui/select.tsx
import * as React from "react";

type SelectProps = {
  value?: string;
  onValueChange?: (v: string) => void;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * A custom Select implementation:
 * - Renders a visual trigger (SelectTrigger + SelectValue)
 * - Overlays a native <select> for accessibility
 * - Collects options from SelectItem children
 */
export const Select: React.FC<SelectProps> = ({
  children,
  value,
  onValueChange,
  className,
  ...rest
}) => {
  // Extract trigger
  const trigger = React.Children.toArray(children).find(
    (c: any) =>
      React.isValidElement(c) &&
      c.type &&
      (c.type as any).displayName === "SelectTrigger"
  );

  // Collect items
  const items: Array<{ value: string; label: React.ReactNode }> = [];
  function collect(node: any) {
    if (!React.isValidElement(node)) return;
    const props: any = node.props || {};
    if (props && props.value !== undefined) {
      items.push({ value: String(props.value), label: props.children });
      return;
    }
    React.Children.forEach(props.children, collect);
  }
  React.Children.forEach(children, collect);

  return (
    <div
      className={className}
      {...rest}
      style={{ position: "relative", display: "inline-block" }}
    >
      <div aria-hidden>
        {trigger ? (trigger as any).props.children : null}
      </div>

      <select
        value={value}
        onChange={(e) => onValueChange && onValueChange(e.target.value)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0,
          cursor: "pointer",
        }}
        aria-hidden={false}
      >
        {items.map((i) => (
          <option key={i.value} value={i.value}>
            {i.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export const SelectTrigger: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ children, ...props }) => {
  const Comp: any = (p: any) => <div {...p}>{children}</div>;
  Comp.displayName = "SelectTrigger";
  return <div {...props}>{children}</div>;
};

export const SelectValue: React.FC<
  React.HTMLAttributes<HTMLSpanElement> & { placeholder?: string }
> = ({ children, placeholder, ...props }) => {
  return <span {...props}>{children || placeholder}</span>;
};

export const SelectContent: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = ({ children, ...props }) => <div {...props}>{children}</div>;

export const SelectItem: React.FC<
  React.HTMLAttributes<HTMLDivElement> & { value: string }
> = ({ children, ...props }) => <div {...props}>{children}</div>;
