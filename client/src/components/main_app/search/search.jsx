import React from "react";

class Search extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      search: ""
    }
    this.updateSearch = this.updateSearch.bind(this);
  }

  updateSearch() {
    return e => this.setState({ search: e.target.value })
  }

  render() {
    return (
      <section className="search-container">
        <form className="search-bar">
          <label htmlFor="search-field" className="search-field-icon">
            <i className="fas fa-search"></i>
          </label>
          <input
            id="search-field"
            type="text"
            value={this.state.search}
            onChange={this.updateSearch}
          />
          <label htmlFor="search-field" className="search-field-x">
            x
          </label>
        </form>
      </section>
    );
  }
}

export default Search