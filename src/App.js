import React from 'react';
import axios from 'axios'
// HTTP call
import request from 'request';
// analytics api
// import admin from 'firebase-admin';
// import "firebase/auth";
// import serviceAccount from './key';

import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'

// Social Icons
import Facebook from './icons/Facebook.svg';
import Instagram from './icons/Instagram.svg';
import Linkedin from './icons/LinkedIn.svg';
import Pinterest from './icons/Pinterest.svg';
import Twitter from './icons/Twitter.svg';
import Slack from './icons/Slack.png';

// MDB React
import { MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { MDBInput, MDBIcon } from 'mdb-react-ui-kit';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText } from "mdbreact";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.toast = this.toast.bind(this);
    this.getUploadParams = this.getUploadParams.bind(this);
    this.handleChangeStatus = this.handleChangeStatus.bind(this);

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.generateLink = this.generateLink.bind(this);
    this.copyLink = this.copyLink.bind(this);
    this.removeLink = this.removeLink.bind(this);
    this.state = {
      name: "",
      link: "",
      title: "",
      description: "",
      image: "https://i.imgur.com/eX9IqTW.png",
      domain: "",
      short: "Unavailable",
      card: [],
      data: []
    };
  }

  componentDidMount() {
    // Analytics API
    // const credential = admin.credential.cert(serviceAccount);
    // credential.getAccessToken();
    // admin.initializeApp({credential: admin.credential.cert(serviceAccount)});
    // const uid = 'some-uid';
    // admin
    //   .auth()
    //   .createCustomToken(uid)
    //   .then((customToken) => {
    //     // Send token back to client
    //     let access_token = customToken;
    //     let url = "https://cors-anywhere.herokuapp.com/https://firebasedynamiclinks.googleapis.com/v1/https://voyagersocial.page.link/ubRU/linkStats?durationDays=7";
    //     var xhr = new XMLHttpRequest();
    //     xhr.open('GET', url , true);
    //     xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    //     // const that = this;
    //     xhr.onload = function () {
    //       var data = this.responseText;
    //       console.log(data);
    //     };
    //     xhr.send(); 
    //   })
    //   .catch((error) => {
    //     console.log('Error creating custom token:', error);
    //   });
    
    // load data from local storage
    if (localStorage.length !== 0) {
      for (var i = 0; i < localStorage.length; i++) {
        let data = JSON.parse(localStorage.getItem(i));
        let components = this.state.card;
        let db = this.state.data;
        let element = 
          <MDBCard cascade>
            <MDBCardImage
              cascade
              className='img-fluid card-image'
              overlay="white-light"
              hover
              src= {data[1]}
            />
            <MDBCardBody cascade>
              <MDBCardTitle>{data[0]}</MDBCardTitle>
              <hr/>
              <MDBCardText className='card-caption'>
                <span className='card-label'>Title</span>
                <span className='card-content'>{data[2]}</span>
                <span className='card-label'>Description</span>
                <span className='card-content'>{data[3]}</span>
                <span className='card-label'>URL</span>
                <span className='card-content'>{data[4]}</span>
                <span className='card-label'>Shorten Link</span>
                <a href={data[5]} target='_blank' rel="noreferrer">
                  <span className='card-content shorten-link'>{data[5]}</span>
                </a>
              </MDBCardText>
            </MDBCardBody>
            <div className='rounded-bottom mdb-color lighten-3 text-center pt-3'>
              <ul className='list-unstyled list-inline font-small'>
                <li className='list-inline-item pr-2 white-text'>
                  <MDBIcon far icon='clock' /> {data[6]}
                </li>
                <li className='list-inline-item blue-text pr-2'>
                  <MDBIcon far icon="hand-point-up" /> 0
                </li>
              </ul>
            </div>
          </MDBCard>
        
        components.push(element);
        db.push(JSON.stringify(data));
        this.setState({ card: components, data: db });
      }
    }
    
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

    // // upload image button
    // document.getElementById('upload-btn').addEventListener('click', function() {
    //   document.getElementById('file').click();
    // });

    // create new link button
    document.getElementById('create-btn').addEventListener('click', function() {
      document.querySelector('.dashboard').style.display = 'none';
      document.querySelector('.builder').style.display = 'block';
    });

    // back to dashboard button
    // document.getElementById('back-btn').addEventListener('click', function() {
    //   document.querySelector('.builder').style.display = 'none';
    //   document.querySelector('.dashboard').style.display = 'block';
    // });
  }

  // when users input or upload image
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
    else if (event.target.classList.contains('name')) {
      this.setState({ name: event.target.value });
    }
  }

  // when users submit the URL
  onSubmit(event) {
    event.preventDefault();

    let loader = document.getElementById('loading');
    loader.style.display = "block";
    
    var url = this.state.link;
    console.log("Requested URL:", url);

    var data = [];
    var that = this;
    var none = 'https://i.imgur.com/eX9IqTW.png';

    // get title, description, image, and domain via API
    request('https://urlpreview.vercel.app/api/v1/preview?url='+url, function (error, response, body) {
      // Print the error if one occurred
      if (error) {
        console.error('error:', error); 
      }
      // Print the response status code if a response was received
      if (response) {
        console.log('Status Code:', response && response.statusCode); 
        loader.style.display = "none";
        if (response.statusCode === 400 || response.statusCode === 401 || response.statusCode === 403) {
          alert('Invalid URL');
        }
      }
      // console.log('body:', body);
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

  // generate short link
  generateLink() {
    if (this.state.name === "") {
      alert('Please type the preview name.');
      document.querySelector('.name').focus();
    }
    else if (this.state.image.length > 1000) {
      alert('Image URL is too long.');
    }
    else {
      document.getElementById('loader').style.display = "block";
      if (this.state.card.length) {
        document.querySelector('.dashboard').style.height = '100%';
      }

      // REST API request for Shorten Link
      let api_key = 'AIzaSyCXFHhZSAjh8v4D_QbET5Q_TaVxtVHlEn0';
      let st = this.state.title;
      let si = this.state.image;
      let sd = this.state.description;
      let domain = "https://voyagersocial.page.link";
      let link = this.state.link;
      let name = this.state.name;

      var bodydata = JSON.stringify({ 
        "dynamicLinkInfo": {
          "domainUriPrefix": domain,
          "link": link,
          "socialMetaTagInfo": {
            "socialTitle": st,
            "socialDescription": sd,
            "socialImageLink": si
          }
        },
        "suffix": {
          "option": "SHORT"
        }
      });
      
      // request firebase short link API
      var url = "https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=" + api_key;
      var xhr = new XMLHttpRequest();
      xhr.open('POST', url , true);
      xhr.setRequestHeader('Content-type', 'application/json');
      const that = this;
      xhr.onload = function () {
        var data = JSON.parse(this.responseText);
        var stlink = data.shortLink;
        console.log("Shorten Link: " + stlink);
        that.setState({ short: stlink }, setComponents);
      };
      xhr.send(bodydata);   

      // component for shorten link card on dashboard
      const setComponents = () => {
        // get today's date
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); 
        var yyyy = today.getFullYear();
        today = mm + '/' + dd + '/' + yyyy;

        let components = this.state.card;
        let db = this.state.data;
        let short = this.state.short;
        
        let element = 
          <MDBCard cascade>
            <MDBCardImage
              cascade
              className='img-fluid card-image'
              overlay="white-light"
              hover
              src= {si}
            />
            <MDBCardBody cascade>
              <MDBCardTitle>{name}</MDBCardTitle>
              <hr/>
              <MDBCardText className='card-caption'>
                <span className='card-label'>Title</span>
                <span className='card-content'>{st}</span>
                <span className='card-label'>Description</span>
                <span className='card-content'>{sd}</span>
                <span className='card-label'>URL</span>
                <span className='card-content'>{link}</span>
                <span className='card-label'>Shorten Link</span>
                <a href={short} target='_blank' rel="noreferrer">
                  <span className='card-content shorten-link'>{short}</span>
                </a>
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
        let arr = [name, si, st, sd, link, short, today];
        db.push(JSON.stringify(arr));
        // save card in local storage
        localStorage.setItem(localStorage.length, JSON.stringify(arr));

        this.setState({ card: components, data: db }, function () {
          document.getElementById('loader').style.display = "none";
          document.querySelector('.builder').style.display = 'none';
          document.querySelector('.dashboard').style.display = 'block';
        });
      }
    }
  }

  // when users click copy link button
  copyLink(index) {
    var inner = document.querySelectorAll('.shorten-link')[index].innerHTML;
    var input = document.createElement('input');
    input.setAttribute('value', inner);
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }

  // when users click remove link button
  removeLink(index) {
    let list = this.state.card;
    let db = this.state.data;
    list.splice(index, 1);
    db.splice(index, 1);
    // remove card in local storage
    localStorage.clear();
    db.forEach(function(elem, index) {
      localStorage.setItem(index, elem);
    });
    
    this.setState({ list, db });

    if (!this.state.card.length) {
      document.querySelector('.dashboard').style.height = '100vh';
    }
  }

  toast = (innerHTML) => {
    const el = document.getElementById('toast')
    el.innerHTML = innerHTML
    el.className = 'show'
    setTimeout(() => { el.className = el.className.replace('show', '') }, 3000)
  }

  getUploadParams = ({ file, meta }) => {
    var vm = this
    var formData = new FormData();
    formData.append("image", file);

    var config = {
      method: 'post',
      url: `${process.env.REACT_APP_LOOK_LINK_API_BASE_URL}/images/preview-link`,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: formData
    };

    axios(config)
      .then(function (response) {
        vm.setState({ image: response.data.url });
      })
      .catch(function (error) {
        console.log(error);
      });
    return { url: 'https://httpbin.org/post' }
  }

  handleChangeStatus = ({ meta, remove }, status) => {
    console.log("DSFDS");
    if (status === 'headers_received') {
      this.toast(`${meta.name} uploaded!`)
      remove()
    } else if (status === 'aborted') {
      this.toast(`${meta.name}, upload failed...`)
    }
  }
  
  render() {
    return (
      <>
        
        <MDBRow className='builder'>
          <MDBCol md='6' className='left-col'>
            <div id='flex-header'>
              <h1 style={{marginLeft: "15px"}}>Create Look Link</h1>
              {/* <MDBBtn className='m-2 btn-rounded' id='back-btn'>
                <MDBIcon icon="arrow-left" className='px-1'/>
                Back to Dashboard
              </MDBBtn> */}
            </div>
            <div className="left-margin">
              <p className="blue-header">Desitnation URL</p>
              <div className="flex-input">
                <div className='full-width'>
                  <MDBInput value={this.state.link} onChange={this.onChange} className='url' label='https://www.example.com' type='url' />
                </div>
                <MDBBtn outline id='submit-btn' onClick={this.onSubmit}>Submit</MDBBtn>
              </div>
              <div className="spinner-border" id="loading" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <p className="blue-header">Title</p>
              <MDBInput value={this.state.title} onChange={this.onChange} className='input-field title' label='Attention Grabbing Headline' type='text' />
              <p className="blue-header">Description</p>
              <MDBInput value={this.state.description} onChange={this.onChange} className='input-field description' 
              textarea rows={4}/>
              {/* <div className="text-center" id='image-url'>
                <MDBInput value={this.state.image} onChange={this.onChange} className='image' label='Image URL' type='url' />
                <input type="file" id="file" onChange={this.onChange} className='file' hidden></input>
                <MDBBtn id='upload-btn' className='m-4 btn-rounded'>
                  <MDBIcon icon="upload" className='px-1'/>
                  Upload Image
                </MDBBtn>
              </div> */}
              <React.Fragment>
              <p className="blue-header">Upload Image</p>
                <Dropzone
                  getUploadParams={this.getUploadParams}
                  onChangeStatus={this.handleChangeStatus}
                  maxFiles={1}
                  multiple={false}
                  canCancel={false}
                  inputContent="Upload a file or drag and drop"
                  styles={{
                    dropzone: { width: "100%", height: 250 },
                    dropzoneActive: { borderColor: 'green' },
                  }}
                />
                <div id="toast"></div>
              </React.Fragment>
              <div className="text-center" id="loader">
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            </div>
            <div id="name">
              <p style={{color: "white"}}>Project Name</p>
              <div className="flex-input">
                <div style={{width: "63%"}}>
                  <MDBInput value={this.state.name} onChange={this.onChange} className='name' type='text' />
                </div>
                <MDBBtn className='m-4' id="generate-btn" onClick={this.generateLink}>
                  <MDBIcon icon="link" className='px-1'/>
                  Generate Link
                </MDBBtn>
              </div>
            </div>
          </MDBCol>
          <MDBCol md='6' className='right-col'>
            <div id='flex-header-right'>
              <h1 style={{marginLeft: "15px"}}>Preview Look Link</h1>
            </div>
            <div id='social-container'>
              <a href='#facebook' className="social-icon"><img src={Facebook}></img></a> 
              <a href='#twitter' className="social-icon"><img src={Twitter}></img></a>  
              <a href='#instagram' className="social-icon"><img src={Instagram}></img></a> 
              <a href='#linkedin' className="social-icon"><img src={Linkedin}></img></a> 
              <a href='#pinterest' className="social-icon"><img src={Pinterest}></img></a> 
              <a href='#slack' className="social-icon">
                <img src={Slack} width="43px" height="43px" 
                style={{borderRadius: "8px"}}></img></a> 
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
          <div className='text-center full-height'>
            <MDBBtn id='create-btn' className='m-4 btn-rounded'>
              <MDBIcon icon="plus" className='px-1'/>
              Create New
            </MDBBtn>
          </div>
          <MDBRow>
            {this.state.card.map((item, index) =>
              <MDBCol key={index} md="4" className='previewCard'>
                {item}
                <div className='text-center'>
                  <MDBBtn className='card-btn btn-rounded' onClick={() => {this.copyLink(index)}}>
                    <MDBIcon far icon="copy" className='px-1'/>
                    Copy Link
                  </MDBBtn>
                  <MDBBtn className='card-btn btn-rounded' onClick={() => {this.removeLink(index)}}>
                    <MDBIcon far icon='trash-alt' className='px-1'/>
                    Delete Link
                  </MDBBtn>
                </div>
              </MDBCol>
            )}
          </MDBRow>
        </div>
        
      </>  
    );
  }
}

export default App;
