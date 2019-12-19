import React from "react";
import { Query } from 'react-apollo';
import Queries from '../../../graphql/queries';
const { FETCH_ALL } = Queries;

class Search extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      search: "",
      results: null
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
            onChange={this.updateSearch()}
            placeholder="Search for Artists, Songs, or Albums"
          />
          <label htmlFor="search-field" className="search-field-x">
            X
          </label>
        </form>
        <Query query={FETCH_ALL}>
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error</p>;

            if(this.state.search === ""){
              return (
                <div className="empty-search">
                  <h3>Start typing to begin searching our library!</h3>
                </div>
              )
            } else {

            }
          }}
        </Query>
      </section>
    );
  }
}

export default Search