import React from 'react';

// http call
import request from 'request';

// MDB react
import { MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { MDBInput, MDBInputGroup, MDBBtn } from 'mdb-react-ui-kit';
import { MDBIcon } from 'mdb-react-ui-kit';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      link: "",
      title: "",
      description: "",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1053&q=80"
    };
  }

  componentDidMount() {
    
  }

  onChange(event) {
    this.setState({link: event.target.value});
  }

  onSubmit(event) {
    event.preventDefault();

    let loader = document.getElementById('loading');
    loader.style.display = "block";
    
    var url = encodeURI(this.state.link);
    console.log(url);

    var data = [];
    var that = this;

    request('https://urlpreview.vercel.app/api/v1/preview?url='+url, function (error, response, body) {
      // Print the error if one occurred
      if (error) {
        console.error('error:', error); 
      }
      // Print the response status code if a response was received
      if (response) {
        console.log('statusCode:', response && response.statusCode); 
        loader.style.display = "none";
      }
      console.log('body:', body); // Print the HTML for the homepage.
      data = JSON.parse(body);
      that.setState({ 
        title: data.title,
        description: data.description,
        image: data.image
      });
    });
  }
  
  render() {
    return (
      <>
        
        <MDBRow>
          <MDBCol md='6' className='left-col'>
            <h1>Create Preview</h1>
            <MDBInputGroup className='input-field'>
              <MDBInput value={this.state.link} onChange={this.onChange} label='Destination URL' type='url' />
              <MDBBtn outline onClick={this.onSubmit}>Submit</MDBBtn>
            </MDBInputGroup>
            <div className="spinner-grow text-primary" id="loading" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <MDBInput value={this.state.title} className='input-field' label='Title' type='text' />
            <MDBInput value={this.state.description} className='input-field' label='Description' textarea rows={4} />
            <div className="text-center">
              <h5>Image</h5>
              <img src={this.state.image} alt='Image does not exist' id='image'></img>
            </div>
          </MDBCol>
          <MDBCol md='6' className='right-col'>
            <h1>Show Preview</h1>
            <MDBBtn size="lg" tag="a" floating social="fb">
              <MDBIcon fab icon="facebook-f" />
            </MDBBtn>
            <MDBBtn size="lg" tag="a" floating social="tw">
              <MDBIcon fab icon="twitter" />
            </MDBBtn>
            <MDBBtn size="lg" tag="a" floating social="ins">
              <MDBIcon fab icon="instagram" />
            </MDBBtn>
            <MDBBtn size="lg" tag="a" floating social="li">
              <MDBIcon fab icon="linkedin-in" />
            </MDBBtn>
            <MDBBtn size="lg" tag="a" floating social="pin">
              <MDBIcon fab icon="pinterest" />
            </MDBBtn>
            <MDBBtn size="lg" tag="a" floating social="slack">
              <MDBIcon fab icon="slack" />
            </MDBBtn>
          </MDBCol>
        </MDBRow>
        
      </>  
    );
  }
}

export default App;
