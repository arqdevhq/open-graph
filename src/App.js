import React from 'react';
// default image
import coffee from './coffee.jpg';
// no image available
import none from './no_image.png';

// http call
import request from 'request';

// MDB react
import { MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { MDBInput, MDBInputGroup } from 'mdb-react-ui-kit';
import { MDBIcon, MDBBtn } from 'mdbreact';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      link: "",
      title: "",
      description: "",
      image: coffee,
      domain: ""
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
    
    var url = this.state.link;
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
        if (response.statusCode === 401) {
          alert('Invalid URL');
        }
      }
      console.log('body:', body);
      data = JSON.parse(body);
      that.setState({ 
        title: data.title,
        description: data.description,
        image: data.image,
        domain: data.domain
      });
      if (!that.state.image) {
        that.setState({ image: none });
      }
      if (!that.state.domain) {
        var temp = document.createElement ('a');
        temp.href = url;
        that.setState({ domain: temp.hostname });
      }
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
            <div className="spinner-border" id="loading" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <MDBInput value={this.state.title} className='input-field' label='Title' type='text' />
            <MDBInput value={this.state.description} className='input-field' label='Description' textarea rows={4} />
            <div className="text-center">
              <h5>Image</h5>
              <img src={this.state.image} alt=' does not exist' id='image'></img>
            </div>
          </MDBCol>
          <MDBCol md='6' className='right-col'>
            <h1>Show Preview</h1>
            <div id='social-container'>
              <MDBBtn size="lg" tag="a" floating social="fb" className='social-icon'>
                <MDBIcon fab icon="facebook-f" />
              </MDBBtn>
              <MDBBtn size="lg" tag="a" floating social="tw" className='social-icon'>
                <MDBIcon fab icon="twitter" />
              </MDBBtn>
              <MDBBtn size="lg" tag="a" floating social="ins" className='social-icon'>
                <MDBIcon fab icon="instagram" />
              </MDBBtn>
              <MDBBtn size="lg" tag="a" floating social="li" className='social-icon'>
                <MDBIcon fab icon="linkedin-in" />
              </MDBBtn>
              <MDBBtn size="lg" tag="a" floating social="pin" className='social-icon'>
                <MDBIcon fab icon="pinterest" />
              </MDBBtn>
              <MDBBtn size="lg" tag="a" floating social="slack" className='social-icon'>
                <MDBIcon fab icon="slack" />
              </MDBBtn>
            </div>
            <div id='social-preview'>
              <div className='preview-list'>
                <h5>Facebook</h5>  
                <div id='facebook-card'>
                  <img id='facebook-image' src={this.state.image} alt='facebook'></img>
                  <div id='facebook-text'>
                    <div id='facebook-link'>{this.state.domain}</div>
                    <div id='facebook-content'>
                      <div id='facebook-title'>{this.state.title}</div>
                      <div id='facebook-description'>{this.state.description}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='preview-list'>
                <h5>Twitter</h5>  
                <div id='twitter-card'>
                  <div id='twitter-image' style={{ backgroundImage:`url(${this.state.image})` }}></div>
                  <div id='twitter-text'>
                    <span id='twitter-title'>{this.state.title}</span>
                    <span id='twitter-description'>{this.state.description}</span>
                    <span id='twitter-link'>{this.state.link}</span>
                  </div>
                </div>
              </div>
            </div>
          </MDBCol>
        </MDBRow>
        
      </>  
    );
  }
}

export default App;
