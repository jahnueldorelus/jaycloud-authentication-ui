import Container from "react-bootstrap/Container";
import NotFoundDoggy from "@assets/404-doggy.svg";
import Button from "react-bootstrap/Button";

export const SSOFailed = () => {
  /**
   * Goes back to the previous page.
   */
  const onBtnClick = () => {
    history.back();
  };

  return (
    <Container className="py-5 d-flex justify-content-center align-items-start text-center">
      <div className="border border-primary w-50 rounded overflow-hidden text-primary">
        <div className="px-3 py-2 bg-primary">
          <h3 className="m-0 text-white">Uh-oh, something went wrong!</h3>
        </div>
        <div className="p-3">
          <img src={NotFoundDoggy} alt="sad dog" width="100" />
          <h5 className="mt-3">
            Woof! It appears that some trouble happened while trying to sign you
            in with our SSO service, my good human. Please click the button
            below to go back to the previous service.
          </h5>

          <Button className="my-3" onClick={onBtnClick}>
            Back to Service
          </Button>

          <h6 className="mt-4 mb-0">
            If the issue persists, please contact us&nbsp;
            <a
              className="text-quaternary"
              href="mailto:support@jahnueldorelus.com?subject=Service - JayCloud: SSO Redirect to Service Error"
            >
              here
            </a>
            .
          </h6>
        </div>
      </div>
    </Container>
  );
};
