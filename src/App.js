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
import { MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText } from "mdbreact";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.generateLink = this.generateLink.bind(this);
    this.removeLink = this.removeLink.bind(this);
    this.state = {
      link: "",
      title: "",
      description: "",
      image: coffee,
      domain: "",
      meta: "",
      card: [],
      counter: 0
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

    // create new link button
    document.getElementById('create-btn').addEventListener('click', function() {
      document.querySelector('.dashboard').style.display = 'none';
      document.querySelector('.builder').style.display = 'block';
    });

    // back to dashboard button
    document.getElementById('back-btn').addEventListener('click', function() {
      document.querySelector('.builder').style.display = 'none';
      document.querySelector('.dashboard').style.display = 'block';
    });
  }

  onChange(event) {
    if (event.target.classList.contains('url')) {
      this.setState({ link: event.target.value });
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

  generateLink() {
    if (this.state.card.length) {
      document.querySelector('.dashboard').style.height = '100%';
    }

    // OG metatags for backend
    let html = 
      '<!DOCTYPE html>'+
      '<html>'+
        '<head>'+
          '<!-- Primary Meta Tags -->'+
          // '<title></title>'+
          '<meta name="title" content='+ this.state.title +'/>'+
          '<meta name="description" content='+ this.state.description +'/>'+
      
          '<!-- Open Graph / Facebook -->'+
          '<meta property="og:type" content="website" />'+
          '<meta property="og:title" content='+ this.state.title +'/>'+
          '<meta property="og:site_name" content='+ this.state.domain +'>'+
          '<meta property="og:description" content='+ this.state.description +'/>'+
          '<meta property="og:image" content='+ this.state.image +'/>'+
      
          '<!-- Twitter -->'+
          '<meta property="twitter:card" content="summary_large_image" />'+
          '<meta property="twitter:url" content='+ this.state.link+'/>'+
          '<meta property="twitter:title" content='+ this.state.title +'/>'+
          '<meta property="twitter:description" content='+ this.state.description +'/>'+
          '<meta property="twitter:image" content='+ this.state.image +'/>'+

          // maybe "no cors" api in the script tag
          // '<script></script>'+
        '</head>'+
        '<body></body>'+
      '</html>'
    ;

    // get today's date
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); 
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;

    let components = this.state.card;

    let element = 
      <MDBCard cascade>
        <MDBCardImage
          cascade
          className='img-fluid card-image'
          overlay="white-light"
          hover
          src= {this.state.image}
        />
        <MDBCardBody cascade>
          <MDBCardTitle contentEditable='true'>Click to make a title</MDBCardTitle>
          <hr/>
          <MDBCardText className='card-caption'>
            <span className='card-label'>Title</span>
            <span className='card-content'>{this.state.title}</span>
            <span className='card-label'>Description</span>
            <span className='card-content'>{this.state.description}</span>
            <span className='card-label'>URL</span>
            <span className='card-content'>{this.state.link}</span>
            <span className='card-label'>Shorten Link</span>
            <span className='card-content'>Unavailable</span>
          </MDBCardText>
        </MDBCardBody>
        <div className='rounded-bottom mdb-color lighten-3 text-center pt-3'>
          <ul className='list-unstyled list-inline font-small'>
            <li className='list-inline-item pr-2 white-text'>
              <MDBIcon far icon='clock' /> {today}
            </li>
            <li className='list-inline-item blue-text pr-2'>
              <MDBIcon far icon="hand-point-up" /> 0
            </li>
          </ul>
        </div>
      </MDBCard>

    components.push(element);

    this.setState({ meta: html, card: components, counter: this.state.counter+1 }, function() {
      console.log(this.state.meta);
      document.querySelector('.builder').style.display = 'none';
      document.querySelector('.dashboard').style.display = 'block';
    });
  }

  removeLink(index) {
    let list = this.state.card;
    list.splice(index, 1);
    this.setState({ list });

    if (!this.state.card.length) {
      document.querySelector('.dashboard').style.height = '100vh';
    }
  }
  
  render() {
    return (
      <>
        
        <MDBRow className='builder'>
          <MDBCol md='6' className='left-col'>
            <div id='flex-header'>
              <h1>Create Preview</h1>
              <MDBBtn rounded className='m-2' id='back-btn'>
                <MDBIcon icon="arrow-left" className='px-1'/>
                Back to Dashboard
              </MDBBtn>
            </div>
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
              <MDBBtn rounded className='m-4' onClick={this.generateLink}>
                <MDBIcon icon="link" className='px-1'/>
                Generate Link
              </MDBBtn>
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

        <div className='dashboard'>
          <MDBRow>
            {this.state.card.map((item, index) =>
              <MDBCol key={index} md="4" className='previewCard'>
                {item}
                <div className='text-center'>
                  <MDBBtn rounded className='card-btn'>
                    <MDBIcon far icon="copy" className='px-1'/>
                    Copy Link
                  </MDBBtn>
                  <MDBBtn rounded className='card-btn' onClick={() => {this.removeLink(index)}}>
                    <MDBIcon far icon='trash-alt' className='px-1'/>
                    Delete Link
                  </MDBBtn>
                </div>
              </MDBCol>
            )}
          </MDBRow>
          <div className='text-center full-height'>
            <MDBBtn rounded id='create-btn' className='m-4'>
              <MDBIcon icon="plus" className='px-1'/>
              Create New
            </MDBBtn>
          </div>
        </div>
        
      </>  
    );
  }
}

export default App;
