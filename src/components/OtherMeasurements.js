import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import LanguageIcon from "@material-ui/icons/Language";
import Tray from "./Tray";
// eslint-disable-next-line
import { Link } from "gatsby";
// eslint-disable-next-line
import { locLang } from "../utils";
//import measurements from "../data/i18n/en/measurements.yaml";

const OtherMeasurements = props => {
  return (
    <Tray
      className="my1"
      icon={<LanguageIcon />}
      title={
        <FormattedMessage
          id="app.otherThing"
          values={{
            thing: props.intl
              .formatMessage({ id: "app.measurements" })
              .toLowerCase()
          }}
        />
      }
    >
      <p>
        FIXME: List of measurements is not available since we have moved
        translation strings to @freesewing/i18n package. This needs to be
        handled when we have measurements available from glue package
      </p>
    </Tray>
  );
};

export default injectIntl(OtherMeasurements);

//<ul>
//  {Object.keys(measurements).map((m, index) => (
//    <li key={"om" + index}>
//      <Link
//        to={locLang.set(
//          "/docs/measurements/" + m.toLowerCase(),
//          props.language
//        )}
//      >
//        <FormattedMessage id={"measurements." + m} />
//      </Link>
//    </li>
//  ))}
//</ul>
