import React from "react";
import { Items, Item, Input } from 'semanticui-react';

//////////////////////////////////////////////////////////////////////////////
// SearchBar Component                                                      //
//////////////////////////////////////////////////////////////////////////////

interface ISearchBarProps {
  placeHolder: string;
  searchString?: string;
  onUserInput: (searchString: string) => void;
}

export const SearchBar = ({ placeHolder, onUserInput }: ISearchBarProps) => (
  <Input search
    icon="search"
    iconPosition="left"
    placeholder={placeHolder}
    onChange={(e: any) => onUserInput(e.target['value']) } />
)

export default SearchBar;

// handleChange(e: React.SyntheticEvent) {
//   this.props.onUserInput(e.target["value"]);
// }
//
// render() {
//   return (
