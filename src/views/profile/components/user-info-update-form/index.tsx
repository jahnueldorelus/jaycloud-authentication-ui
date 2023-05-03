import { useState, useRef, useEffect, useContext } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FormModelInputOption } from "@app-types/form-model";
import { EditableInput } from "@components/editable-input";
import { ClassName } from "@services/class-name";
import { objectService } from "@services/object";
import ErrorSVG from "@assets/error-circle.svg";
import SuccessSVG from "@assets/success-circle.svg";
import Alert from "react-bootstrap/Alert";
import { userContext } from "@context/user";

type UserInfoUpdateFormProps = {
  formInputs: FormModelInputOption[];
};

export const UserInfoUpdateForm = (props: UserInfoUpdateFormProps) => {
  const [updateErrorMessage, setUpdateErrorMessage] = useState<string | null>(
    null
  );
  const [updateSuccessMessage, setUpdateSuccessMessage] = useState<
    string | null
  >(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [userModifiedInputs, setUserModifiedInputs] = useState<
    Record<string, string>
  >({});
  const [inputsValidity, setInputsValidity] = useState<Record<string, boolean>>(
    {}
  );
  const alertTimeout = useRef<NodeJS.Timeout | null>(null);
  const userConsumer = useContext(userContext);

  // Manages a timer for showing an alert for the api response of updating a user
  useEffect(() => {
    if (alertTimeout.current) {
      clearTimeout(alertTimeout.current);
    }

    if (updateErrorMessage || updateSuccessMessage) {
      alertTimeout.current = setTimeout(() => {
        resetAlertMessages();
      }, 5000);
    }
  }, [updateErrorMessage, updateSuccessMessage]);

  // Validates the registration form upon user input
  useEffect(() => {
    validateForm();
  }, [userModifiedInputs]);

  /**
   * Validates the form model.
   */
  const validateForm = () => {
    const formInputsValidity: Record<string, boolean> = {};
    const formInputs = props.formInputs;

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
      Object.values(userModifiedInputs).some((input) => input.length > 0) &&
      Object.keys(formInputsValidity).length > 0 &&
      Object.values(formInputsValidity).every((value) => value === true);

    setInputsValidity(formInputsValidity);
    setIsFormValid(formIsValid);
  };

  /**
   * Removes all alert messages.
   */
  const resetAlertMessages = () => {
    setUpdateErrorMessage(null);
    setUpdateSuccessMessage(null);
  };

  /**
   * Handles the change of the text for an input.
   * @param formModelInput The form model input option
   * @param newInputValue The new value from the input
   */
  const onInputChange =
    (formModelInput: FormModelInputOption) => (newInputValue: string) => {
      const inputName = formModelInput.name;

      const userModifiedInputsCopy =
        objectService.shallowClone(userModifiedInputs);

      // Removes the saved input if it's new text is empty
      if (newInputValue.length === 0) {
        delete userModifiedInputsCopy[inputName];
      } else {
        userModifiedInputsCopy[inputName] = newInputValue;
      }
      setUserModifiedInputs(userModifiedInputsCopy);
    };

  /**
   * Handles submitting the form
   */
  const onFormSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (isFormValid) {
      resetAlertMessages();
      const result = await userConsumer.methods.updateUserProfile(
        userModifiedInputs
      );

      if (result.errorOccurred) {
        setUpdateErrorMessage(result.errorMessage);
        setUpdateSuccessMessage(null);
      } else {
        setUpdateErrorMessage(null);
        setUpdateSuccessMessage("Successfully updated your profile");
        setInputsValidity({});
        setIsFormValid(false);
        setUserModifiedInputs({});
      }
    }
  };

  return (
    <Form>
      <Container className="px-0 pt-4">
        {/* An alert to show if updating the user's profile fails */}
        <Alert
          className="py-2 d-flex w-fit"
          variant="danger"
          show={!!updateErrorMessage}
        >
          <img src={ErrorSVG} alt={"A red X in a circle"} width={20} />
          <p className="m-0 ms-2">{updateErrorMessage}</p>
        </Alert>

        {/* An alert to show if updating the user's profile passes */}
        <Alert
          className="py-2 d-flex w-fit"
          variant="success"
          show={!!updateSuccessMessage}
        >
          <img
            src={SuccessSVG}
            alt={"A green checkmark in a circle"}
            width={20}
          />
          <p className="m-0 ms-2">{updateSuccessMessage}</p>
        </Alert>
      </Container>

      <Row xs={1} md={2} lg={3}>
        {props.formInputs.map((modelInput, index) => {
          const inputName = modelInput.name;
          const inputText = userModifiedInputs[inputName] || "";
          const isInputValid = !!inputsValidity[modelInput.name];
          const authReqProcessing = userConsumer.state.authReqProcessing

          return (
            <Col key={index}>
              <EditableInput
                formModelName={inputName}
                input={modelInput}
                inputText={inputText}
                isInputValid={isInputValid}
                placeholder={`Enter your new ${modelInput.label.toLowerCase()}`}
                labelClassName="text-primary"
                invalidMessageClassName="mt-1 text-warning"
                onTextChange={onInputChange(modelInput)}
                disabled={authReqProcessing}
              />
            </Col>
          );
        })}
      </Row>

      <Container className="px-0 mb-3 d-flex justify-content-center justify-content-md-end">
        <Button
          className="mt-2"
          type="submit"
          variant="primary"
          aria-disabled={!isFormValid}
          onClick={onFormSubmit}
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
          {userConsumer.state.authReqProcessing ? "Loading" : "Update Profile"}
        </Button>
      </Container>
    </Form>
  );
};
