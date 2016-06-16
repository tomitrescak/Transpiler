import * as React from 'react';
import { config } from 'semanticui-react';
import { Link } from 'react-router';

config.linkElement = (props: any) => ( <Link to={props.href} {...props} /> );

// init({
//   Accordion: false,
//   Button: true,
//   Checkbox: true,
//   Radio: false,
//   Comments: false,
//   Divider: true,
//   Dropdown: true,
//   Feed: false,
//   Form: true,
//   Grid: true,
//   Header: true,
//   Input: true,
//   Items: false,
//   Label: false,
//   List: true,
//   Loading: true,
//   Menu: true,
//   Message: true,
//   Modal: false,
//   Progress: false,
//   Rating: false,
//   Segment: true,
//   Search: false,
//   Steps: false,
//   Tabs: false
// });

export default function() { }
