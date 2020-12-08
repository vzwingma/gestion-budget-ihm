import React, { Component } from "react";

class Contact extends Component {

  state = {
        infos: []
      }

      componentDidMount() {
      console.log('I was triggered during componentDidMount')

        fetch('http://localhost:8091/actuator/info')
        .then(res => res.json())
        .then((data) => {
            console.log('I was triggered during data')
            this.setState({ infos: data })
        })
        .catch(console.log)
      }

  render() {
    return (
      <div>
        <h2>GOT QUESTIONS?</h2>
        <p>The easiest thing to do is post on
        our <a href="http://forum.kirupa.com">forums</a>.
        </p>
      </div>
    );
  }
}

export default Contact;