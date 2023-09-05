import { useEffect, useState, useRef, useContext } from "react";
import ErrorSVG from "@assets/error-circle.svg";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { ClassName } from "@services/class-name";
import { EditableInput } from "@components/editable-input";
import { FormModel, FormModelInputOption } from "@app-types/form-model";
import { objectService } from "@services/object";
import { formModelService } from "@services/form-model";
import { NavLink, useSearchParams, useNavigate } from "react-router-dom";
import { UIError } from "@components/ui-error";
import { uiRoutes, uiSearchParams } from "@components/navbar/routes";
import { Loader } from "@components/loader";
import { userContext } from "@context/user";
import { sessionStorageService } from "@services/session-storage";
import { FocusableReference } from "@components/focusable-reference";
import "./index.scss";

export const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userConsumer = useContext(userContext);
  const loadedInitialData = useRef(false);
  const topOfFormRef = useRef<HTMLDivElement>(null);
  const [authenticationForm, setAuthenticationForm] = useState<
    FormModel | null | undefined
  >(undefined);
  const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>(
    null
  );
  const [isFormValid, setIsFormValid] = useState(false);
  const [userModifiedInputs, setUserModifiedInputs] = useState<
    Record<string, string>
  >({});
  const [inputsValidity, setInputsValidity] = useState<Record<string, boolean>>(
    {}
  );

  /**
   * Retrieves the authentication form and deletes any session information that
   * determines the view to display after the user successfully authenticates.
   */
  useEffect(() => {
    if (!loadedInitialData.current) {
      const getAuthenticationForm = async () => {
        loadedInitialData.current = true;
        setAuthenticationForm(await formModelService.getAuthenticationForm());
      };

      getAuthenticationForm();
    }
  }, []);

  // Validates the authentication form upon user input
  useEffect(() => {
    validateForm();
  }, [userModifiedInputs]);

  // Navigates to the appropriate page upon logging in
  useEffect(() => {
    if (userConsumer.state.user) {
      const isSSOLogin = searchParams.get(uiSearchParams.sso);

      // Handles SSO authentication if that's what was requested
      if (isSSOLogin && isSSOLogin === "true") {
        userConsumer.methods.serviceRedirectAfterLogin();
      }

      // Navigates to the view that required authentication. Defaults to the home page
      else {
        const viewToLoad = sessionStorageService.getViewBeforeAuth();
        navigate(viewToLoad || uiRoutes.home);
      }
    }
  }, [userConsumer.state.user]);

  /**
   * Determines if the form can be submitted.
   */
  const formCanBeSubmitted = () => {
    return isFormValid && !loginErrorMessage;
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
      setLoginErrorMessage(null);
    };

  /**
   * Handles submitting the form
   */
  const onFormSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (formCanBeSubmitted()) {
      const result = await userConsumer.methods.signInUser(userModifiedInputs);

      // Brings the focus back to the top of the form
      if (topOfFormRef.current) {
        topOfFormRef.current.focus();
      }

      if (result.errorOccurred) {
        setLoginErrorMessage(result.errorMessage);
      } else {
        setLoginErrorMessage(null);
      }
    }
  };

  /**
   * Validates the form model.
   */
  const validateForm = () => {
    const formInputsValidity: Record<string, boolean> = {};

    if (
      authenticationForm &&
      !objectService.isObjectEmpty(userModifiedInputs)
    ) {
      const formInputs = authenticationForm.inputs;

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
   * Click handler for the registration link.
   * @param event HTML anchor element mouse event
   */
  const onClickRegisterLink = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();

    navigate({
      pathname: uiRoutes.register,
      search: searchParams.toString(),
    });
  };

  /**
   * Retrieves the form model JSX.
   */
  const formModelJSX = (): JSX.Element => {
    if (authenticationForm) {
      const title = authenticationForm.title;
      const inputs = authenticationForm.inputs;

      return (
        <Container
          fluid="md"
          className="login-form p-0 text-white bg-senary rounded overflow-hidden shadow"
          data-testid="login-form"
        >
          <div className="px-4 py-2 bg-primary">
            <h3 className="m-0">{title}</h3>
          </div>

          <div className="px-4 pt-4">
            <Alert
              className="py-2 d-flex"
              variant="danger"
              show={!!loginErrorMessage}
            >
              <img
                src={ErrorSVG}
                alt={"a red X in a circle"}
                width={20}
                aria-hidden={true}
              />
              <p className="m-0 ms-2" data-testid="form-error-message">
                {loginErrorMessage}
              </p>
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
                    ? "Logging In"
                    : "Login"}
                </Button>
              </div>

              <div className="my-4">
                <p className="mb-0">Don't have an account?</p>
                <a
                  className="text-secondary text-decoration-none"
                  href={uiRoutes.register}
                  onClick={onClickRegisterLink}
                >
                  Create a new account
                </a>

                <p className="mb-0 mt-4">Forgot your password?</p>
                <NavLink
                  className="text-secondary text-decoration-none"
                  to={uiRoutes.forgotPassword}
                >
                  Reset password
                </NavLink>
              </div>
            </Form>
          </div>
        </Container>
      );
    } // Failed to get authentication form from api
    else if (authenticationForm === null) {
      return <UIError />;
    }
    // Page is loading initial data
    else {
      return <Loader />;
    }
  };
  return (
    <Container
      className="view-login py-5 bg-tertiary d-flex align-items-center"
      fluid
    >
      {formModelJSX()}
    </Container>
  );
};
