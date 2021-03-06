import React from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { Link } from "gatsby";
import { FormattedMessage, FormattedHTMLMessage } from "react-intl";
import { locLang } from "../../../utils";

const ResetPasswordForm = ({
  handleToggleTrouble,
  handlePasswordReset,
  intl,
  checkInbox
}) => {
  if (checkInbox)
    return (
      <div>
        <h2 className="xt-left">
          <FormattedMessage id="app.yay" />
        </h2>
        <h3 className="xt-left">
          <FormattedMessage id="app.checkInboxClickLinkInConfirmationEmail" />
        </h3>
        <h4 className="xt-left">
          <FormattedMessage id="app.goAheadWeWillWait" />
        </h4>
        <a href="#trouble" className="mimic" onClick={handleToggleTrouble}>
          <FormattedMessage id="app.logIn" />
        </a>
        &nbsp;|&nbsp;
        <Link to={locLang.set("/signup", intl.locale)}>
          <FormattedMessage id="app.signUpForAFreeAccount" />
        </Link>
        &nbsp;|&nbsp;
        <Link to={locLang.set("/contact", intl.locale)}>
          <FormattedMessage id="app.contactUs" />
        </Link>
      </div>
    );
  return (
    <div>
      <h5 className="txt-left">
        <FormattedMessage id="app.troubleLoggingIn" />
      </h5>
      <ul className="txt-left">
        <li>
          <FormattedHTMLMessage id="app.emailWorksToo" />
        </li>
        <li>
          <FormattedHTMLMessage id="app.forgotLoginInstructions" />.
        </li>
      </ul>
      <form onSubmit={handlePasswordReset}>
        <TextField
          id="username"
          name="username"
          autoFocus={true}
          fullWidth={true}
          autoComplete="username"
          label={intl.formatMessage({ id: "account.email" })}
          margin="normal"
          variant="outlined"
        />
        <div className="txt-center mt05">
          <Button
            type="submit"
            color="primary"
            size="large"
            variant="contained"
            classes={{ root: "mt10" }}
          >
            <FormattedMessage id="app.resetPassword" />
          </Button>
        </div>
      </form>
      <div className="txt-center">
        <a href="#trouble" className="mimic" onClick={handleToggleTrouble}>
          <FormattedMessage id="app.logIn" />
        </a>
        &nbsp;|&nbsp;
        <Link to={locLang.set("/contact", intl.locale)}>
          <FormattedMessage id="app.contactUs" />
        </Link>
      </div>
    </div>
  );
};

ResetPasswordForm.propTypes = {
  handleToggleTrouble: PropTypes.func.isRequired
};

export default ResetPasswordForm;
