import React from "react";
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@material-ui/icons/Search';
import SearchResults from './searchResults'

export default class SearchBar extends React.Component {

  constructor(props) {
    super(props)
    this.state ={
      searchInput: '',
      newInput: 'false',
      renderChild: true,
      results: []
    }
  this.handleChildUnmount = this.handleChildUnmount.bind(this);
  }

  handleChildUnmount(){
    this.setState({renderChild: false});
  }

  Search = styled('div')(({ theme }) => ({
        color: 'black',
        position: "relative",
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        "&:hover": {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        [theme.breakpoints.up("sm")]: {
            margin: "0 auto",
            minWidth: "500px",
            maxWidth: "100%",
        },
    }));
  SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));

  StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('lg')]: {
        width: '50ch',
      }
    },
  }));

  delay = ms => new Promise(res => setTimeout(res, ms));

  delayFunction = async () => {
    await this.delay(500);
  };
  onInputChange = async (event) => {
    this.setState({searchInput: event.target.value, newInput: false})
    await this.delayFunction()
    this.setState({newInput: true, renderChild: true})
  }

render() {
  return (
    <>
      <this.Search>
        <this.SearchIconWrapper>
          <SearchIcon />
        </this.SearchIconWrapper>
        <this.StyledInputBase
          onChange={this.onInputChange}
          placeholder="Search…"
          inputProps={{ 'aria-label': 'search' }}
        />
        {(this.state.renderChild && this.state.newInput) && this.state.searchInput.length > 2 ? 
        <SearchResults
        searchInput={this.state.searchInput}
        unmountMe={this.handleChildUnmount}/> :
        ''}
      </this.Search>    
    </>
  )
}
}

