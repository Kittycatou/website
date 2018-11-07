import React from "react";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { setUserAccount } from "../../../store/actions/user";
import {
  showNotification,
  closeNotification
} from "../../../store/actions/notification";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import UsernameIcon from "@material-ui/icons/PermIdentity";
import EmailIcon from "@material-ui/icons/Email";
import PasswordIcon from "@material-ui/icons/VpnKey";
import EditIcon from "@material-ui/icons/Edit";
import TwitterIcon from "../../TwitterIcon";
import InstagramIcon from "../../InstagramIcon";
import GithubIcon from "../../GithubIcon";
import UnitsIcon from "@material-ui/icons/Public";
import LanguageIcon from "@material-ui/icons/Translate";
import PatronIcon from "@material-ui/icons/Favorite";
import ConsentIcon from "@material-ui/icons/CheckCircleOutline";
import BioIcon from "@material-ui/icons/ChatBubbleOutline";
import Switch from "@material-ui/core/Switch";
import SocialLink from "../../SocialLink";
import FieldInfo from "./FieldInfo";
import FieldForm from "./FieldForm";
import Button from "@material-ui/core/Button";
import BackIcon from "@material-ui/icons/KeyboardArrowLeft";
import SaveIcon from "@material-ui/icons/Save";
import backend from "../../../backend";
import remark from "remark";
import html from "remark-html";

class AccountContainer extends React.Component {
  state = {
    editing: false,
    username: false,
    password: "******************",
    email: false,
    bio: false,
    units: false,
    language: false,
    github: false,
    twitter: false,
    instagram: false,
    profile: false,
    model: false,
    openData: false
  };

  componentDidMount() {
    this.userToState();
  }

  userToState() {
    let user = this.props.user;
    this.setState({
      ...this.state,
      username: user.username,
      email: user.email,
      bio: user.bio,
      units: user.settings.units,
      language: user.settings.language,
      github: user.social.github || "",
      twitter: user.social.twitter || "",
      instagram: user.social.instagram || "",
      patron: user.patron,
      profile: user.consent.profile,
      model: user.consent.model,
      openData: user.consent.openData,
      editing: false
    });
  }

  handleStartEditing = key => {
    this.setState({
      ...this.state,
      editing: key
    });
  };

  handleStopEditing = () => {
    this.userToState();
  };

  saveAccount = (data, field) => {
    backend
      .saveAccount(data)
      .then(res => {
        if (res.status === 200) {
          let msg = this.props.intl.formatMessage(
            { id: "app.fieldSaved" },
            { field: this.props.intl.formatMessage({ id: "account." + field }) }
          );
          if (field === "email")
            msg +=
              "<br />" +
              this.props.intl.formatMessage({
                id: "app.checkInboxClickLinkInConfirmationEmail"
              });
          this.props.showNotification("success", msg);
          this.props.setUserAccount(res.data.account);
        }
      })
      .catch(err => {
        console.log(err);
        this.props.showNotification("error", err);
      });
  };

  handleValueSave = evt => {
    evt.preventDefault();
    let field = evt.target.attributes["data-field"].value;
    this.setState({
      ...this.state,
      editing: false
    });
    let data = {};
    switch (field) {
      case "username":
      case "email":
      case "bio":
        data[field] = this.state[field];
        this.saveAccount(data, field);
        break;
      case "password":
        data = {
          newPassword: evt.target.elements.namedItem("newPassword").value,
          currentPassword: evt.target.elements.namedItem("currentPassword")
            .value
        };
        this.saveAccount(data, field);
        break;
      case "units":
      case "language":
        data.settings = {};
        data.settings[field] = this.state[field];
        this.saveAccount(data, field);
        break;
      case "github":
      case "twitter":
      case "instagram":
        data.social = {};
        data.social[field] = this.state[field];
        this.saveAccount(data, field);
        break;
      default:
        return "";
    }
  };

  handleValueUpdate = evt => {
    let value = evt.target.value; // Needed because setState is async
    let newState = { ...this.state };
    newState[this.state.editing] = value;
    this.setState(state => newState);
  };

  formatValue = (field, value) => {
    switch (field) {
      case "language":
        return <FormattedMessage id={"i18n." + value} />;
      case "patron":
        if (value === 2)
          return [
            <FormattedMessage id="app.patron-2" key="msg" />,
            <span key="emoji" role="img" aria-label=":)">
              {" "}
              😀{" "}
            </span>
          ];
        if (value === 4)
          return [
            <FormattedMessage id="app.patron-4" key="msg" />,
            <span key="emoji" role="img" aria-label=":)">
              {" "}
              😘
            </span>
          ];
        if (value === 8)
          return [
            <FormattedMessage id="app.patron-8" key="msg" />,
            <span key="emoji" role="img" aria-label=":D">
              {" "}
              😍
            </span>
          ];
        return [
          <FormattedMessage id="app.no" key="msg" />,
          <span key="emoji" role="img" aria-label=":(">
            {" "}
            😞{" "}
          </span>
        ];
        break;
      case "units":
        return value ? <FormattedMessage id={"app." + value + "Units"} /> : "";
      case "github":
      case "twitter":
      case "instagram":
        if (value === "") return value;
        else return <SocialLink site={field} account={value} />;
      case "email":
        if (value !== this.props.user.email)
          return (
            <span>
              {value}{" "}
              <em>
                (<FormattedMessage id="app.pendingConfirmation" />)
              </em>
            </span>
          );
        else return value;
        break;
      default:
        return value;
    }
  };

  patronValue = rank => {
    if (rank === 2) return [<FormattedMessage id="app.patron-2" />, " 😀"];
    if (rank === 4) return [<FormattedMessage id="app.patron-4" />, " 😘"];
    if (rank === 8) return [<FormattedMessage id="app.patron-8" />, " 😍"];
    return [<FormattedMessage id="app.no" />, " 😞"];
  };

  items = [
    {
      key: "username",
      icon: <UsernameIcon />,
      value: this.props.user.username
    },
    {
      key: "email",
      icon: <EmailIcon />,
      value: this.props.user.email
    },
    {
      key: "password",
      icon: <PasswordIcon />,
      value: "****************"
    },
    {
      key: "bio",
      icon: <BioIcon />,
      value: this.props.user.bio
    },
    {
      key: "units",
      icon: <UnitsIcon />,
      value: (
        <FormattedMessage
          id={"app." + this.props.user.settings.units + "Units"}
        />
      )
    },
    {
      key: "language",
      icon: <LanguageIcon />,
      value: (
        <FormattedMessage id={"i18n." + this.props.user.settings.language} />
      )
    },
    {
      key: "github",
      icon: <GithubIcon />,
      value: this.props.user.social.github ? (
        <SocialLink site="github" account={this.props.user.social.github} />
      ) : (
        ""
      )
    },
    {
      key: "twitter",
      icon: <TwitterIcon />,
      value: this.props.user.social.twitter ? (
        <SocialLink site="twitter" account={this.props.user.social.twitter} />
      ) : (
        ""
      )
    },
    {
      key: "instagram",
      icon: <InstagramIcon className="primary" />,
      value: this.props.user.social.instagram ? (
        <SocialLink
          site="instagram"
          account={this.props.user.social.instagram}
        />
      ) : (
        ""
      )
    },
    {
      key: "patron",
      icon: <PatronIcon color="primary" />,
      value: this.patronValue(this.props.user.patron),
      noSave: true
    }
  ];

  consent = [
    {
      key: "consentForProfileData",
      icon: <ConsentIcon color="primary" />,
      value: this.patronValue(this.props.user.patron)
    },
    {
      key: "consentForModelData",
      icon: <ConsentIcon color="primary" />,
      value: this.patronValue(this.props.user.patron)
    }
  ];

  render() {
    let items = this.items;
    let consent = this.consent;
    let edit = this.state.editing;
    return (
      <div className="content">
        <h1>
          <FormattedMessage id="app.settings" />
        </h1>
        {edit !== false ? (
          <form onSubmit={this.handleValueSave} data-field={edit}>
            <FieldForm
              intl={this.props.intl}
              field={edit}
              value={this.state[edit]}
              handleValueUpdate={this.handleValueUpdate}
              data={this.props.data}
              location={this.props.location}
            />
            <div className="txt-right">
              <Button
                onClick={this.handleStopEditing}
                className="mr10"
                variant="outlined"
              >
                <BackIcon />
                <FormattedMessage id="app.back" />
              </Button>
              {edit === "patron" ? (
                ""
              ) : (
                <Button type="submit" variant="contained" color="primary">
                  <SaveIcon className="mr10" />
                  <FormattedMessage id="app.save" />
                </Button>
              )}
            </div>
            <FieldInfo intl={this.props.intl} field={edit} />
          </form>
        ) : (
          <div className="overpad1">
            <List component="nav">
              {items.map((item, index) => (
                <ListItem
                  button
                  key={"settingitem-" + index}
                  onClick={() => this.handleStartEditing(item.key)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText>
                    <div className="keyval">
                      <span className="key" key={"key-" + index}>
                        <FormattedMessage id={"account." + item.key} />
                      </span>
                      <span className="val" key={"val-" + index}>
                        {this.formatValue(item.key, this.state[item.key])}
                      </span>
                    </div>
                  </ListItemText>
                  <ListItemSecondaryAction>
                    <IconButton
                      aria-label="Comments"
                      onClick={() => this.handleStartEditing(item.key)}
                    >
                      <EditIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </div>
        )}
      </div>
    );
  }
}
//{consent.map((item, index) => (
//  <ListItem button={false} key={"consentitem-" + index}>
//    <ListItemIcon>{item.icon}</ListItemIcon>
//    <ListItemText>
//      <div className="keyval">
//        <span className="key">
//          <FormattedMessage id={"gdpr." + item.key} />
//        </span>
//      </div>
//    </ListItemText>
//    <ListItemSecondaryAction>
//      <Switch checked={item.value || false} color="primary" />
//    </ListItemSecondaryAction>
//  </ListItem>
//))}

const mapStateToProps = state => ({
  user: state.user,
  notification: state.notification
});

const mapDispatchToProps = dispatch => ({
  setUserAccount: account => dispatch(setUserAccount(account)),
  showNotification: (style, message) =>
    dispatch(showNotification(style, message)),
  closeNotification: () => dispatch(closeNotification())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(AccountContainer));
