import {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  CSSProperties,
  forwardRef,
  useId,
} from "react";
import { useToastStore, ToastType } from "../../lib/toastStore";
import { Icon } from "./Icon";
import "./UI.css";

/* ==========================================================================
   1. BUTTON COMPONENT
   ========================================================================== */
export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;
  const classes = [
    "btn",
    `btn-${variant}`,
    `btn-${size}`,
    isLoading ? "btn-loading" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} disabled={isDisabled} {...props}>
      {isLoading ? (
        <span className="btn-spinner" aria-hidden="true" />
      ) : (
        leftIcon && <span className="btn-icon">{leftIcon}</span>
      )}
      <span className="btn-text">{children}</span>
      {!isLoading && rightIcon && <span className="btn-icon">{rightIcon}</span>}
    </button>
  );
}

/* ==========================================================================
   2. INPUT COMPONENT
   ========================================================================== */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  touched?: boolean;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, touched, helperText, id: customId, className = "", ...props },
  ref
) {
  const generatedId = useId();
  const inputId = customId || generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;
  const hasError = Boolean(error && (touched ?? true));

  return (
    <div className={`input-field-group ${hasError ? "has-error" : ""}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {props.required && <span className="required-star"> *</span>}
        </label>
      )}

      <input
        ref={ref}
        id={inputId}
        className={`input-control ${className}`}
        aria-invalid={hasError}
        aria-describedby={
          hasError ? errorId : helperText ? helperId : undefined
        }
        {...props}
      />

      {hasError ? (
        <p id={errorId} role="alert" className="input-error-msg">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="input-helper-msg">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

/* ==========================================================================
   3. SKELETON COMPONENT
   ========================================================================== */
interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
  style?: CSSProperties;
}

export function Skeleton({
  width = "100%",
  height = "20px",
  borderRadius = "var(--radius-sm)",
  className = "",
  style,
}: SkeletonProps) {
  const customStyle: CSSProperties = {
    width,
    height,
    borderRadius,
    ...style,
  };

  return <div className={`skeleton-shimmer ${className}`} style={customStyle} aria-hidden="true" />;
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <Skeleton height="220px" borderRadius="var(--radius-md) var(--radius-md) 0 0" />
      <div className="skeleton-card-body">
        <Skeleton width="40%" height="16px" />
        <Skeleton width="85%" height="24px" />
        <Skeleton width="100%" height="16px" />
        <Skeleton width="60%" height="16px" />
        <div className="skeleton-card-footer">
          <Skeleton width="50%" height="28px" />
          <Skeleton width="35%" height="38px" borderRadius="var(--radius-md)" />
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   4. TOAST CONTAINER COMPONENT
   ========================================================================== */
function getToastIcon(type: ToastType) {
  switch (type) {
    case "success":
      return <Icon name="check" size={18} color="var(--success)" />;
    case "error":
      return <Icon name="alert" size={18} color="var(--danger)" />;
    case "warning":
      return <Icon name="alert" size={18} color="var(--warning)" />;
    case "info":
      return <Icon name="sparkles" size={18} color="var(--secondary)" />;
    default:
      return null;
  }
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-portal-container" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-card toast-${toast.type}`} role="alert">
          <span className="toast-icon">{getToastIcon(toast.type)}</span>
          <span className="toast-text">{toast.message}</span>
          <button
            type="button"
            className="toast-close"
            onClick={() => removeToast(toast.id)}
            aria-label="Đóng thông báo"
          >
            <Icon name="close" size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

