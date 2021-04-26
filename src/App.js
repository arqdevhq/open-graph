import React from 'react';
// default image
import coffee from './coffee.jpg';
// no image available
import none from './no_image.png';

// http call
import request from 'request';

// MDB react
import { MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { MDBInput, MDBInputGroup, MDBIcon } from 'mdb-react-ui-kit';
import { MDBBtn } from "mdbreact";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onGenerateUrl = this.onGenerateUrl.bind(this);
    this.state = {
      link: "",
      title: "",
      description: "",
      image: coffee,
      domain: "",
      generated_url:""
    };
  }

  componentDidMount() {
    // Trigger a submit button click on enter
    var input = document.querySelector('.url');
    input.addEventListener("keyup", function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();

        document.getElementById("submit-btn").click();
      }
    });

    // click icon to scroll to corresponding social media
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
          e.preventDefault();
          
          document.querySelector(this.getAttribute('href')).scrollIntoView({
              behavior: 'smooth'
          });
      });
    });

    // upload image button
    document.getElementById('upload-btn').addEventListener('click', function() {
      document.getElementById('file').click();
    });

    // generate link button
    // document.getElementById('generate-btn').addEventListener('click', function() {
    //   alert('Generating link is not available yet.');
    // });
  }

  onGenerateUrl(event) {
    event.preventDefault();
    var url = encodeURI(this.state.link);
    var that = this;
    const options = {
      method: 'POST',
      url: 'http://app.local:8080/rest/v2/short-urls',          // Shlink API Url
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        'X-Api-Key': '0637d4e0-adef-48f2-a64e-25974f9774a1',     // Shlink API key
        // useQueryString: true
      },
      form: {'findIfExists': false, 'longUrl': url, 'validateUrl': false}
    };
    
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      if (response) {
        console.log('statusCode:', response && response.statusCode); 
        var data = JSON.parse(body);
        if (response.statusCode === 400) {
          alert(data.detail);
        }else {
          that.setState({ 
            generated_url: data.shortUrl
          });
        }
        console.log(body);
      }
    });
  }

  onChange(event) {
    if (event.target.classList.contains('url')) {
      this.setState({ link: event.target.value, generated_url:'' });
    }
    else if (event.target.classList.contains('title')) {
      this.setState({ title: event.target.value });
    }
    else if (event.target.classList.contains('description')) {
      this.setState({ description: event.target.value });
    }
    else if (event.target.classList.contains('image')) {
      this.setState({ image: event.target.value });
    }
    else if (event.target.classList.contains('file')) {
      var reader = new FileReader();
      var that = this;
      reader.onload = function (e) {
        that.setState({ image: e.target.result });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
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
        if (response.statusCode === 401 || response.statusCode === 403) {
          alert('Invalid URL');
        }
      }
      console.log('body:', body);
      data = JSON.parse(body);
      that.setState({ domain: data.domain });
      // insert title data only if it exists to avoid error
      if (data.title) {
        that.setState({ title: data.title });
      }
      else {
        that.setState({ title: "" });
      }
      // insert description data only if it exists to avoid error
      if (data.description) {
        that.setState({ description: data.description });
      }
      else {
        that.setState({ description: "" });
      }
      // if image does not exist, show preset no image
      if (!data.image) {
        that.setState({ image: none });
      }
      else {
        that.setState({ image: data.image });
      }
      // if domain does not exist, extract hostname from link
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
              <MDBInput value={this.state.link} onChange={this.onChange} className='url' label='Destination URL' type='url' />
              <MDBBtn outline id='submit-btn' onClick={this.onSubmit}>Submit</MDBBtn>
            </MDBInputGroup>
            <div className="spinner-border" id="loading" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <MDBInput value={this.state.title} onChange={this.onChange} className='input-field title' label='Title' type='text' />
            <MDBInput value={this.state.description} onChange={this.onChange} className='input-field description' 
            label='Description' textarea rows={4}/>
            <MDBInput value={this.state.image} onChange={this.onChange} className='image' label='Image URL' type='url' />
            <div className="text-center">
              <img src={this.state.image || ""} alt=' does not exist' id='image'></img>
            </div>
            <div className="text-center">
              <input type="file" id="file" onChange={this.onChange} className='file' hidden></input>
              <MDBBtn rounded id='upload-btn' className='m-4'>
                <MDBIcon icon="upload" className='px-1'/>
                Upload Image
              </MDBBtn>
              <MDBBtn rounded id='generate-btn' onClick={this.onGenerateUrl} className='m-4'>
                <MDBIcon icon="link" className='px-1'/>
                Generate Link
              </MDBBtn>
              {this.state.generated_url!=''
                ? (
                  <MDBInput value={this.state.generated_url} className='form-control' label='Generated URL' type='url' />
                )
                : null
              }
            </div>
          </MDBCol>
          <MDBCol md='6' className='right-col'>
            <h1>Show Preview</h1>
            <div id='social-container'>
              <a href='#facebook' className="facebook social-icon"><i className="fa fa-facebook"></i></a> 
              <a href='#twitter' className="twitter social-icon"><i className="fa fa-twitter"></i></a> 
              <a href='#instagram' className="instagram social-icon"><i className="fa fa-instagram"></i></a> 
              <a href='#linkedin' className="linkedin social-icon"><i className="fa fa-linkedin"></i></a>
              <a href='#pinterest' className="pinterest social-icon"><i className="fa fa-pinterest"></i></a> 
              <a href='#slack' className="slack social-icon"><i className="fa fa-slack"></i></a> 
            </div>
            <div id='social-preview'>
              <div id='facebook' className='preview-list'>
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
              <div id='twitter' className='preview-list'>
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
              <div id='instagram' className='preview-list'>
                <h5>Instagram</h5>  
                <div id='instagram-card'>
                  <div id='instagram-image' style={{ backgroundImage:`url(${this.state.image})` }}></div>
                  <div id='instagram-text'>
                    <span id='instagram-title'>{this.state.title}</span>
                    <span id='instagram-description'>{this.state.description}</span>
                  </div>
                </div>
              </div>
              <div id='linkedin' className='preview-list'>
                <h5>Linkedin</h5>  
                <div id='linkedin-card'>
                  <div id='linkedin-image' style={{ backgroundImage:`url(${this.state.image})` }}></div>
                  <div id='linkedin-text'>
                    <span id='linkedin-title'>{this.state.title}</span>
                    <span id='linkedin-link'>{this.state.domain}</span>
                  </div>
                </div>
              </div>
              <div id='pinterest' className='preview-list'>
                <h5>Pinterest</h5>  
                <div id='pinterest-card'>
                  <img id='pinterest-image' src={this.state.image} alt='pinterest'></img>
                  <div id='pinterest-text'>
                    <div id='pinterest-title'>{this.state.title}</div>
                    <div id='pinterest-dots'>
                      <div className='pinterest-dot'></div>
                      <div className='pinterest-dot'></div>
                      <div className='pinterest-dot'></div>
                    </div>
                  </div>
                </div>
              </div>
              <div id='slack' className='preview-list'>
                <h5>Slack</h5>  
                <div id='slack-card'>
                  <div id='slack-bar'></div>
                  <div id='slack-content'>
                    <div id='slack-link'>{this.state.domain}</div>
                    <div id='slack-title'>{this.state.title}</div>
                    <div id='slack-description'>{this.state.description}</div>
                    <img id='slack-image' src={this.state.image} alt='slack'></img>
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
