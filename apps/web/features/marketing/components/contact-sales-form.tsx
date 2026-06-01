"use client";

import { useId, useState } from "react";
import { validateContactSales, type ContactSalesInput } from "../validation/contact-sales-validation";

type FieldName = keyof ContactSalesInput;

const fields: Array<{
  name: FieldName;
  label: string;
  type?: string;
  required?: boolean;
  multiline?: boolean;
}> = [
  { name: "name", label: "Name", required: true },
  { name: "company", label: "Company", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone" },
  { name: "message", label: "Message", required: true, multiline: true },
];

export function ContactSalesForm() {
  const baseId = useId();
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [confirmed, setConfirmed] = useState(false);

  function onSubmit(formData: FormData) {
    const result = validateContactSales(formData);
    setErrors(result.errors);
    setConfirmed(result.ok);
  }

  return (
    <form className="form-panel" action={onSubmit} noValidate>
      <div className="form-grid">
        {fields.map((field) => {
          const fieldId = `${baseId}-${field.name}`;
          const error = errors[field.name];
          const errorId = `${fieldId}-error`;

          return (
            <label key={field.name} className="field" htmlFor={fieldId}>
              <span>
                {field.label}
                {field.required ? <span aria-hidden="true"> *</span> : null}
              </span>
              {field.multiline ? (
                <textarea
                  id={fieldId}
                  name={field.name}
                  rows={5}
                  aria-invalid={error ? "true" : "false"}
                  aria-describedby={error ? errorId : undefined}
                  required={field.required}
                />
              ) : (
                <input
                  id={fieldId}
                  name={field.name}
                  type={field.type ?? "text"}
                  aria-invalid={error ? "true" : "false"}
                  aria-describedby={error ? errorId : undefined}
                  required={field.required}
                />
              )}
              {error ? (
                <span id={errorId} className="field-error" role="alert">
                  {error}
                </span>
              ) : null}
            </label>
          );
        })}
      </div>
      <button className="button button--primary" type="submit">
        Contact Sales
      </button>
      {confirmed ? (
        <p className="status-message" role="status">
          Thanks. This demo confirms the form details locally and does not create a CRM record yet.
        </p>
      ) : null}
    </form>
  );
}
