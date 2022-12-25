import { RegisterLoaderData } from "@app-types/register";
import { FormModelInputOption } from "@app-types/form-model";
import { Fragment, useContext, useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { EditableInput } from "@components/editable-input";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import { userService } from "@services/user";
import { authStore } from "@store/index";
import ErrorSVG from "@assets/error-circle.svg";
import { ClassName } from "@services/api/class-name";

export const Register = () => {
  const navigate = useNavigate();
  const loaderData = useLoaderData() as RegisterLoaderData;
  const authState = useContext(authStore);
  const [inputsValidity, setInputsValidity] = useState<Record<string, boolean>>(
    {}
  );
  const [userModifiedInputs, setUserModifiedInputs] = useState<
    Record<string, string>
  >({});
  const [isFormValid, setIsFormValid] = useState(true);
  const [createUserErrorMessage, setCreateUserErrorMessage] = useState<
    string | null
  >(null);
  const [isApiRequestPending, setApiRequestPending] = useState(false);

  // Validates the registration form upon user input
  useEffect(() => {
    validateForm();
  }, [userModifiedInputs]);

  /**
   * Determines if an object is empty.
   */
  const isObjectEmpty = (obj: object) => {
    return Object.keys(obj).length === 0;
  };

  /**
   * Handles the change of the text for an input.
   * @param formModelInput The form model input option
   * @param newInputValue The new value from the input
   */
  const onInputChange =
    (formModelInput: FormModelInputOption) => (newInputValue: string) => {
      const inputName = formModelInput.name;

      const userModifiedInputsCopy = { ...userModifiedInputs };
      userModifiedInputsCopy[inputName] = newInputValue;
      setUserModifiedInputs(userModifiedInputsCopy);
    };

  /**
   * Handles submitting the form
   */
  const onFormSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setApiRequestPending(true);
    const result = await userService.createUser(
      userModifiedInputs,
      authState.dispatch
    );
    setApiRequestPending(false);

    if (result.errorOccurred) {
      setCreateUserErrorMessage(result.errorMessage);
    } else {
      setCreateUserErrorMessage(null);
      navigate("/");
    }
  };

  /**
   * Validates the form model.
   */
  const validateForm = () => {
    const formInputsValidity: Record<string, boolean> = {};

    if (loaderData.formModel && !isObjectEmpty(userModifiedInputs)) {
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
    }

    // Determines if all inputs are valid
    const formIsValid =
      Object.keys(formInputsValidity).length > 0 &&
      Object.values(formInputsValidity).every((value) => value === true);

    setInputsValidity(formInputsValidity);
    setIsFormValid(formIsValid);
  };

  const formModelJSX = (): JSX.Element => {
    if (loaderData.formModel) {
      const title = loaderData.formModel.title;
      const inputs = loaderData.formModel.inputs;

      return (
        <Fragment>
          <Container className="px-4 py-2 bg-primary">
            <h3 className="m-0">{title}</h3>
          </Container>

          <Container className="px-4 pt-4">
            {createUserErrorMessage && (
              <Alert className="py-2 d-flex" variant="danger">
                <img src={ErrorSVG} alt={"A red X in a circle"} width={20} />
                <p className="m-0 ms-2">{createUserErrorMessage}</p>
              </Alert>
            )}
            <p>* Required Input</p>
            <Form>
              <Row md="2">
                {inputs.map((modelInput, index) => {
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
                        disabled={isApiRequestPending}
                      />
                    </Form.Group>
                  );
                })}
              </Row>

              <Container className="px-0 my-3 d-flex justify-content-end">
                <Button
                  type="submit"
                  variant="primary"
                  aria-disabled={!isFormValid}
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
                  {isApiRequestPending ? "Loading" : "Create Account"}
                </Button>
              </Container>
            </Form>
          </Container>
        </Fragment>
      );
    } else {
      return <></>;
    }
  };

  return (
    <Container>
      <Container
        fluid="md"
        className="p-0 mt-5 text-white bg-senary rounded overflow-hidden"
      >
        {formModelJSX()}
      </Container>
    </Container>
  );
};
