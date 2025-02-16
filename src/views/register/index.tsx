import { FormModel, FormModelInputOption } from "@app-types/form-model";
import { useContext, useEffect, useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { EditableInput } from "@components/editable-input";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import { formModelService } from "@services/form-model";
import ErrorSVG from "@assets/error-circle.svg";
import { ClassName } from "@services/class-name";
import { objectService } from "@services/object";
import { useSearchParams, useNavigate } from "react-router-dom";
import { UIError } from "@components/ui-error";
import { uiRoutes, uiSearchParams } from "@components/navbar/routes";
import { Loader } from "@components/loader";
import { userContext } from "@context/user";
import { sessionStorageService } from "@services/session-storage";
import { FocusableReference } from "@components/focusable-reference";
import "./index.scss";

export const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userConsumer = useContext(userContext);
  const loadedInitialData = useRef(false);
  const topOfFormRef = useRef<HTMLDivElement>(null);
  const [registrationForm, setRegistrationForm] = useState<
    FormModel | null | undefined
  >(undefined);
  const [inputsValidity, setInputsValidity] = useState<Record<string, boolean>>(
    {}
  );
  const [userModifiedInputs, setUserModifiedInputs] = useState<
    Record<string, string>
  >({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [createUserErrorMessage, setCreateUserErrorMessage] = useState<
    string | null
  >(null);

  /**
   * Retrieves the registration form.
   */
  useEffect(() => {
    if (!loadedInitialData.current) {
      const getRegistrationForm = async () => {
        loadedInitialData.current = true;
        setRegistrationForm(await formModelService.getRegistrationForm());
      };

      getRegistrationForm();
    }
  }, []);

  // Validates the registration form upon user input
  useEffect(() => {
    validateForm();
  }, [userModifiedInputs]);

  // Navigates to the appropriate page upon logging in
  useEffect(() => {
    if (userConsumer.state.user) {
      const viewToLoad = sessionStorageService.getViewBeforeAuth();
      const isSSOLogin = searchParams.get(uiSearchParams.sso);

      // Handles SSO authentication if that's what was requested
      if (isSSOLogin && isSSOLogin === "true") {
        userConsumer.methods.serviceRedirectAfterLogin();
      } else {
        // Navigates to the view that required authentication. Defaults to the home page
        navigate(viewToLoad || uiRoutes.home);
      }
    }
  }, [userConsumer.state.user]);

  /**
   * Determines if the form can be submitted.
   */
  const formCanBeSubmitted = () => {
    return isFormValid && !createUserErrorMessage;
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
      setCreateUserErrorMessage(null);
    };

  /**
   * Handles submitting the form
   */
  const onFormSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (formCanBeSubmitted()) {
      const result = await userConsumer.methods.createNewUser(
        userModifiedInputs
      );

      // Brings the focus back to the top of the form
      if (topOfFormRef.current) {
        topOfFormRef.current.focus();
      }

      if (result.errorOccurred) {
        setCreateUserErrorMessage(result.errorMessage);
      } else {
        setCreateUserErrorMessage(null);
      }
    }
  };

  /**
   * Validates the form.
   */
  const validateForm = () => {
    const formInputsValidity: Record<string, boolean> = {};

    if (registrationForm && !objectService.isObjectEmpty(userModifiedInputs)) {
      const formInputs = registrationForm.inputs;

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
   * Click handler for the login link.
   * @param event HTML anchor element mouse event
   */
  const onClickLoginLink = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();

    navigate({
      pathname: uiRoutes.login,
      search: searchParams.toString(),
    });
  };

  const formModelJSX = (): JSX.Element => {
    if (registrationForm) {
      const title = registrationForm.title;
      const inputs = registrationForm.inputs;

      return (
        <Container
          fluid="md"
          className="register-form p-0 text-white bg-senary rounded overflow-hidden shadow"
          data-testid="register-form"
        >
          <Container className="px-4 py-2 bg-primary">
            <h3 className="m-0">{title}</h3>
          </Container>

          <div className="px-4 pt-4">
            <Alert
              className="py-2 d-flex"
              variant="danger"
              show={!!createUserErrorMessage}
              aria-live="polite"
              data-testid="form-error-message"
            >
              <img
                src={ErrorSVG}
                alt={"A red X in a circle"}
                width={20}
                aria-hidden={true}
              />
              <p className="m-0 ms-2">{createUserErrorMessage}</p>
            </Alert>

            <p>* Required Input</p>

            <Form>
              <FocusableReference ref={topOfFormRef} />

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
                      disabled={userConsumer.state.authReqProcessing}
                    />
                  </Form.Group>
                );
              })}

              <div className="my-4 d-flex justify-content-center">
                <Button
                  className="mt-2"
                  type="submit"
                  variant="primary"
                  aria-disabled={!formCanBeSubmitted()}
                  onClick={onFormSubmit}
                  data-testid="form-submit-button"
                >
                  <Spinner
                    className={
                      new ClassName("me-2").addClass(
                        userConsumer.state.authReqProcessing,
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
                  {userConsumer.state.authReqProcessing
                    ? "Creating Account"
                    : "Create Account"}
                </Button>
              </div>
            </Form>

            <div className="my-4">
              <p className="mb-0">Have an account?</p>
              <a
                href={uiRoutes.login}
                onClick={onClickLoginLink}
                className="text-secondary text-decoration-none"
              >
                Log into your account
              </a>
            </div>
          </div>
        </Container>
      );
    }
    // Failed to get registration form from api
    else if (registrationForm === null) {
      return <UIError />;
    }
    // Page is loading initial data
    else {
      return <Loader />;
    }
  };

  return (
    <Container
      className="view-register py-5 bg-tertiary d-flex align-items-center"
      fluid
    >
      {formModelJSX()}
    </Container>
  );
};
