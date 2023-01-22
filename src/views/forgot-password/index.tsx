import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import { EditableInput } from "@components/editable-input";
import { ForgotPasswordLoaderData } from "@app-types/views/forgot-password";
import { useLoaderData, useNavigate } from "react-router-dom";
import { UIError } from "@components/ui-error";
import { useEffect, useRef, useState } from "react";
import { FormModelInputOption } from "@app-types/form-model";
import { userService } from "@services/user";
import ErrorSVG from "@assets/error-circle.svg";
import { ClassName } from "@services/class-name";
import { objectService } from "@services/object";
import "./index.scss";
import { uiRoutes } from "@components/navbar/routes";

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const loaderData = useLoaderData() as ForgotPasswordLoaderData;
  const requestWasSubmitted = useRef(false);
  const [isApiRequestPending, setApiRequestPending] = useState(false);
  const [passwordResetErrorMessage, setPasswordResetErrorMessage] = useState<
    string | null
  >(null);
  const [timeBeforeTokenExp, setTimeBeforeTokenExp] = useState<string | null>(
    null
  );
  const [isFormValid, setIsFormValid] = useState(false);
  const [userModifiedInputs, setUserModifiedInputs] = useState<
    Record<string, string>
  >({});
  const [inputsValidity, setInputsValidity] = useState<Record<string, boolean>>(
    {}
  );

  // Validates the form upon user input
  useEffect(() => {
    validateForm();
  }, [userModifiedInputs]);

  /**
   * Handles the change of the text for an input.
   * @param formModelInput The form model input option
   * @param newInputValue The new value from the input
   */
  const onInputChange =
    (formModelInput: FormModelInputOption) => (newInputValue: string) => {
      // If the user hasn't already submitted a request to reset their password
      if (!requestWasSubmitted.current) {
        const inputName = formModelInput.name;

        const userModifiedInputsCopy = { ...userModifiedInputs };
        userModifiedInputsCopy[inputName] = newInputValue;
        setUserModifiedInputs(userModifiedInputsCopy);
      }
    };

  /**
   * Handles submitting the form
   */
  const onFormSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (isFormValid) {
      setApiRequestPending(true);
      const result = await userService.resetPassword(userModifiedInputs);

      if (result.errorOccurred) {
        setPasswordResetErrorMessage(result.errorMessage);
      } else {
        setTimeBeforeTokenExp(result.timeBeforeTokenExp);
        setPasswordResetErrorMessage(null);
        requestWasSubmitted.current = true;
      }

      setApiRequestPending(false);
    }
  };

  /**
   * Goes back to the previous page.
   */
  const goBackAPage = () => {
    if (!isApiRequestPending) {
      navigate(uiRoutes.login);
    }
  };

  /**
   * Validates the form model.
   */
  const validateForm = () => {
    const formInputsValidity: Record<string, boolean> = {};

    if (
      loaderData.formModel &&
      !objectService.isObjectEmpty(userModifiedInputs)
    ) {
      const formInputs = loaderData.formModel.inputs;

      // Validates each form input
      formInputs.forEach((input) => {
        const inputName = input.name;
        const inputText = userModifiedInputs[inputName];
        const isInputRequired = input.validation.required;
        const inputRegexes = input.validation.regex;

        // If the user didn't give an input and an input is required
        if (!inputText) {
          formInputsValidity[inputName] = isInputRequired ? false : true;
        }
        // Tests against the input's regex(es)
        else {
          formInputsValidity[inputName] = inputRegexes.every((regex) => {
            return RegExp(regex).test(inputText) === true;
          });
        }
      });

      // Determines if all inputs are valid
      const formIsValid =
        Object.keys(formInputsValidity).length > 0 &&
        Object.values(formInputsValidity).every((value) => value === true);

      setInputsValidity(formInputsValidity);
      setIsFormValid(formIsValid);
    }
  };

  /**
   * Retrieves the form model JSX.
   */
  const formModelJSX = (): JSX.Element => {
    if (loaderData.formModel) {
      const formModelTitle = loaderData.formModel.title;
      const formModelInputs = loaderData.formModel.inputs;

      return (
        <Container className="password-reset-form py-5 d-flex justify-content-center">
          <Card className="w-fit rounded overflow-hidden shadow">
            {/* FORM HEADER */}
            <Card.Header className="px-3 py-2 bg-primary text-white fs-3">
              <h3 className="m-0"> {formModelTitle}</h3>
            </Card.Header>

            {/* FORM BODY */}
            <Card.Body className="px-3 py-4 bg-senary text-white">
              {/* If a reset request hasn't been submitted */}
              {!requestWasSubmitted.current && (
                <Card.Text className="mb-4 fs-6 text-center text-md-start">
                  To reset your password, please fill the form below.
                  <br />
                  <br />* Required Input
                </Card.Text>
              )}

              <Form>
                {/* FORM SUBMISSION ERROR */}
                {passwordResetErrorMessage && (
                  <Alert className="py-2 d-flex" variant="danger">
                    <img
                      src={ErrorSVG}
                      alt={"A red X in a circle"}
                      width={20}
                    />
                    <p className="m-0 ms-2">{passwordResetErrorMessage}</p>
                  </Alert>
                )}

                {/* FORM INPUTS */}
                {formModelInputs.map((modelInput, index) => {
                  const inputName = modelInput.name;
                  const inputText = userModifiedInputs[inputName] || "";
                  const isInputValid = !!inputsValidity[modelInput.name];

                  return (
                    <Form.Group key={index}>
                      <EditableInput
                        formModelName={inputName}
                        input={modelInput}
                        inputText={inputText}
                        isInputValid={isInputValid}
                        placeholder={`Enter your ${modelInput.label.toLowerCase()}`}
                        labelClassName="text-white"
                        invalidMessageClassName="mt-1 text-warning"
                        onTextChange={onInputChange(modelInput)}
                        disabled={
                          isApiRequestPending || requestWasSubmitted.current
                        }
                      />
                    </Form.Group>
                  );
                })}

                {/* FORM BUTTONS */}
                <Container
                  className={
                    new ClassName(
                      "p-0 mt-4 d-flex justify-content-evenly"
                    ).addClass(requestWasSubmitted.current, "d-none", "d-flex")
                      .fullClass
                  }
                >
                  <Button
                    className="mt-2"
                    type="button"
                    variant="primary"
                    aria-disabled={isApiRequestPending}
                    onClick={goBackAPage}
                  >
                    Cancel
                  </Button>

                  <Button
                    className="mt-2"
                    type="submit"
                    variant="primary"
                    aria-disabled={!isFormValid || isApiRequestPending}
                    onClick={onFormSubmit}
                  >
                    <Spinner
                      className={
                        new ClassName("me-2").addClass(
                          isApiRequestPending,
                          "d-inline-block",
                          "d-none"
                        ).fullClass
                      }
                      animation="grow"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      as="span"
                    />
                    {isApiRequestPending ? "Loading" : "Submit"}
                  </Button>
                </Container>
              </Form>

              {/* If a reset request has been submitted */}
              {requestWasSubmitted.current && (
                <Card.Text className="mb-0 fs-6 text-center text-md-start">
                  If the email provided above is registered, an email with a
                  reset link will be sent to it. Please check your inbox.
                  <br />
                  <br />
                  <span className="text-secondary">
                    If you cannot find an email in your inbox, please check your
                    spam folder.
                  </span>
                  <br />
                  <br />
                  {timeBeforeTokenExp && (
                    <span className="text-warning rounded">
                      *You have&nbsp;<strong>{timeBeforeTokenExp}</strong>
                      &nbsp;before the reset link expires.*
                    </span>
                  )}
                </Card.Text>
              )}
            </Card.Body>
          </Card>
        </Container>
      );
    } else {
      return <UIError />;
    }
  };

  return (
    <Container className="view-forgot-password d-flex align-items-center" fluid>
      {formModelJSX()}
    </Container>
  );
};
