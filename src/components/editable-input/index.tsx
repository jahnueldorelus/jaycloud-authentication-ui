import { FormModelInputOption } from "@app-types/form-model";
import FormSelect from "react-bootstrap/FormSelect";
import FormControl from "react-bootstrap/FormControl";
import SuccessSVG from "@assets/success-circle.svg";
import ErrorSVG from "@assets/error-circle.svg";
import { ClassName } from "@services/class-name";
import "./index.scss";

type EditableInputProps = {
  formModelName: string;
  input: FormModelInputOption;
  inputText: string;
  placeholder?: string;
  isInputValid: boolean;
  labelClassName?: string;
  invalidMessageClassName?: string;
  disabled?: boolean;
  onTextChange: (newText: string) => void;
};

export const EditableInput = (props: EditableInputProps) => {
  const inputLabel = props.input.label;
  const inputName = props.input.name;
  const inputID = `form-model-editable-input-${props.formModelName
    .replaceAll(" ", "-")
    .toLowerCase()}-${props.input.label.replaceAll(" ", "-").toLowerCase()}`;
  const inputRequired = props.input.validation.required;
  const inputRegex = props.input.validation.regex;
  const inputRegexErrorLabel = props.input.validation.regexErrorLabel;
  const inputText = props.inputText;
  const inputType = props.input.type;
  const inputPlaceholder = props.placeholder;
  const isInputValid = props.isInputValid;
  const isInputMultiline = props.input.multiline;
  const inputSelectOptions = props.input.selectOptions;
  const inputSelectSelectedOption = props.input.selectSelectedOption;

  /**
   * Handles the change of the text for the input.
   * @param newValue The new value for the input
   */
  const onInputChange = (newValue: string) => {
    if (!props.disabled) {
      /**
       * Removes spaces from the start and possibly at the end of the input if spaces
       * are not allowed
       */
      inputRegex.forEach((regex) => {
        if (!regex.includes("\\s") || regex.includes("^\\s")) {
          newValue = newValue.trimStart().trimEnd();
        }
      });

      props.onTextChange(newValue);
    }
  };

  /**
   * Handles input change for the textfield input.
   * @param textfieldElement The modified textfield element
   */
  const onTextfieldChange = (
    textfieldElement: React.FormEvent<HTMLInputElement>
  ) => {
    const newValue = textfieldElement.currentTarget.value;
    onInputChange(newValue);
  };

  /**
   * Handles input change for the select input.
   * @param selectElement The modified select element
   */
  const onSelectChange = (
    selectElement: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newValue = selectElement.currentTarget.value;
    onInputChange(newValue);
  };

  /**
   * Handles input change for the textarea input.
   * @param textAreaElement The modified textarea element
   */
  const onTextAreaChange = (
    textAreaElement: React.FormEvent<HTMLTextAreaElement>
  ) => {
    textAreaElement.currentTarget.style.height = `${textAreaElement.currentTarget.scrollHeight}px`;
    const newValue = textAreaElement.currentTarget.value;
    onInputChange(newValue);
  };

  /**
   * Retrieves the JSX of the input depending on its type.
   */
  const getInputJSX = () => {
    if (inputType === "select") {
      return selectInputJSX();
    } else if (isInputMultiline) {
      return textAreaInputJSX();
    } else {
      return textFieldInputJSX();
    }
  };

  /**
   * The select JSX of the input.
   */
  const selectInputJSX = () => {
    if (inputSelectOptions) {
      return (
        <FormSelect
          className="form-model-editable-input border-0"
          required={inputRequired}
          onChange={onSelectChange}
          value={inputSelectSelectedOption}
          name={inputName}
          aria-disabled={props.disabled}
        >
          {inputSelectOptions.map((opt, index) => {
            return (
              <option key={index} value={opt.value}>
                {opt.label}
              </option>
            );
          })}
        </FormSelect>
      );
    } else {
      return <></>;
    }
  };

  /**
   * The textarea JSX of the input.
   */
  const textAreaInputJSX = () => {
    return (
      <FormControl
        as="textarea"
        id={inputID}
        name={inputName}
        className="form-model-editable-input w-100 rounded border-0 fs-6 px-2"
        required={inputRequired}
        onInput={onTextAreaChange}
        value={inputText}
        aria-disabled={props.disabled}
        readOnly={props.disabled}
      />
    );
  };

  /**
   * The textfield JSX of the input.
   */
  const textFieldInputJSX = () => {
    return (
      <FormControl
        as="input"
        id={inputID}
        name={inputName}
        className="form-model-editable-input w-100 rounded border-0 fs-6 px-2"
        required={inputRequired}
        onInput={onTextfieldChange}
        value={inputText}
        placeholder={inputPlaceholder}
        type={
          inputType === "alpha" ||
          inputType === "alphanumeric" ||
          inputType === "numeric"
            ? "text"
            : inputType
        }
        aria-disabled={props.disabled}
        readOnly={props.disabled}
      />
    );
  };

  return (
    <div key={inputLabel} className="mb-3">
      {/* Input label */}
      <label
        htmlFor={inputID}
        className={
          new ClassName("mb-1 fs-5").addClass(
            !!props.labelClassName,
            props.labelClassName,
            "text-primary"
          ).fullClass
        }
      >
        {inputLabel + (inputRequired ? " *" : "")}
      </label>

      {/* Input Content */}
      <div className="d-flex align-items-center">
        {getInputJSX()}
        <img
          className={
            new ClassName("form-model-editable-image ms-3").addClass(
              !!inputText,
              "visible",
              "d-none"
            ).fullClass
          }
          src={isInputValid ? SuccessSVG : ErrorSVG}
          alt={isInputValid ? "A green checkmark" : "A red X in a circle"}
          height={25}
          width={25}
        />
      </div>

      {/* Input invalid error message */}
      {!isInputValid && inputText && (
        <p
          className={
            new ClassName("m-0 p-1").addClass(
              !!props.invalidMessageClassName,
              props.invalidMessageClassName,
              "text-danger"
            ).fullClass
          }
        >
          {inputRegexErrorLabel}
        </p>
      )}
    </div>
  );
};
