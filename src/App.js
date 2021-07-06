import React from 'react';
import axios from 'axios'
// HTTP call
import request from 'request';

import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'

// Social Icons
import Facebook from './icons/Facebook.svg';
import Instagram from './icons/Instagram.svg';
import Linkedin from './icons/LinkedIn.svg';
import Pinterest from './icons/Pinterest.svg';
import Twitter from './icons/Twitter.svg';
import Slack from './icons/Slack.png';

// Material Tailwind
import "@material-tailwind/react/tailwind.css";
import Card from "@material-tailwind/react/Card";
import CardImage from "@material-tailwind/react/CardImage";
import CardBody from "@material-tailwind/react/CardBody";
import CardFooter from "@material-tailwind/react/CardFooter";
import H6 from "@material-tailwind/react/Heading6";
import Paragraph from "@material-tailwind/react/Paragraph";
import Button from "@material-tailwind/react/Button";
import "tailwindcss/tailwind.css"

// loading animation
import spin from "./spin.gif"

// MDB React
// import { MDBRow, MDBCol } from 'mdb-react-ui-kit';
// import { MDBInput, MDBIcon } from 'mdb-react-ui-kit';
// import { MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText } from "mdbreact";

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

    // const token = "f0eyBlspFIwoXZbI60aqmJBgp0lHqurOS66EKhJTA6ZbQSpEhcOLXBGQxtJFPVYyIIeCcr7TWxGheS1f"
    // const url = 'https://www.nytimes.com/'

    // const requestUrl = `https://api.opengraphr.com/v1/og?api_token=${token}&url=${encodeURIComponent(url)}`
    // fetch(requestUrl)
    //     .then(response => response.json())
    //     .then(og => {
    //         console.table(og)
    //     })
    
    // load data from local storage
    if (localStorage.length !== 0) {
      for (var i = 0; i < localStorage.length; i++) {
        let data = JSON.parse(localStorage.getItem(i));
        let components = this.state.card;
        let db = this.state.data;
        let element = 
          <Card>
            <CardImage
              src= {data[1]}
              alt="Card Image"
            />
            <CardBody>
              <H6 color="gray">{data[0]}</H6>
              <hr/>
              <Paragraph color="gray" className='card-caption'>
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
              </Paragraph>
            </CardBody>
            <CardFooter className="flex-footer">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {data[6]}
              </div>
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                <span style={{marginLeft: "7px"}}> 0</span>
              </div>
            </CardFooter>
          </Card>
        
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
          <Card>
            <CardImage
              alt="Card Image"
              src= {si}
            />
            <CardBody>
              <H6 color="gray">{name}</H6>
              <hr/>
              <Paragraph color="gray" className='card-caption'>
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
              </Paragraph>
            </CardBody>
            <CardFooter className="flex-footer">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {today}
              </div>
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                <span style={{marginLeft: "7px"}}> 0</span>
              </div>
            </CardFooter>
          </Card>

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
        
        <div className='re-row builder'>
          <div className='re-col-md-6 left-col'>
            <div id='flex-header'>
              <h1 style={{marginLeft: "15px", fontSize: "30px"}}>Create Look Link</h1>
              {/* <MDBBtn className='m-2 btn-rounded' id='back-btn'>
                <MDBIcon icon="arrow-left" className='px-1'/>
                Back to Dashboard
              </MDBBtn> */}
            </div>
            <div className="left-margin">
              <p className="blue-header">Desitnation URL</p>

              <div className="flex items-center justify-center bg-white">
                <div className="w-full mx-auto"><div>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <div className="input-border relative flex items-stretch flex-grow focus-within:z-10">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
                    <input type="url" className="url focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded rounded-l-md pl-10 sm:text-sm border-1 border-gray-500" placeholder="   https://www.example.com"
                      value={this.state.link} onChange={this.onChange}></input>
                  </div>
                  <button className="rounded -ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      id='submit-btn' onClick={this.onSubmit}>
                    <span>Submit</span>
                  </button>
                </div>
              </div>
                </div>
              </div>

              {/* <div className="flex-input">
                <div className='full-width'>
                  <MDBInput value={this.state.link} onChange={this.onChange} className='url' label='https://www.example.com' type='url' />
                </div>
                <MDBBtn outline id='submit-btn' onClick={this.onSubmit}>Submit</MDBBtn>
              </div> */}
              <img src={spin} id="loading" width="100px" height="100px"></img>
              {/* <div className="spinner-border" id="loading" role="status">
                <span className="sr-only">Loading...</span>
              </div> */}
              <p className="blue-header">Title</p>

              <div className="w-full mx-auto"><div>
              <div className="mt-1 flex rounded-md shadow-sm">
                <div className="relative flex items-stretch flex-grow focus-within:z-10">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"></div>
                  <input type="text" className="title py-1 input-border focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded rounded-l-md pl-10 sm:text-sm border-1 border-gray-500" placeholder="   Attention Grabbing Headline"
                    value={this.state.title} onChange={this.onChange}></input>
                </div>
              </div>
              </div>
              </div>

              {/* <MDBInput value={this.state.title} onChange={this.onChange} className='input-field title' label='Attention Grabbing Headline' type='text' /> */}
              <p className="blue-header">Description</p>
              {/* <MDBInput value={this.state.description} onChange={this.onChange} className='input-field description' 
              textarea rows={4}/> */}
              <textarea className="description resize-y py-1 border rounded-md w-full h-24 focus:ring-indigo-500 focus:border-indigo-500 border-2 border-gray-500"
              value={this.state.description} onChange={this.onChange}></textarea>
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
                    dropzone: { width: "100%", height: 200 },
                    dropzoneActive: { borderColor: 'green' },
                  }}
                />
                <div id="toast"></div>
              </React.Fragment>
              <img src={spin} id="loader" width="100px" height="100px"></img>
              {/* <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div> */}
            </div>
            <div id="name">
              <p style={{color: "white"}}>Project Name</p>
              <div className="flex-input">
                <div style={{width: "63%"}}>
                  <input type="text" className="name py-1 mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded rounded-l-md pl-10 sm:text-sm border-1 border-gray-500"
                    value={this.state.name} onChange={this.onChange}></input>
                  {/* <MDBInput value={this.state.name} onChange={this.onChange} className='name' type='text' /> */}
                </div>
                {/* <MDBBtn className='m-4' id="generate-btn" onClick={this.generateLink}>
                  <MDBIcon icon="link" className='px-1'/>
                  Generate Link
                </MDBBtn> */}
                <button className="m-4 rounded -ml-px inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    id='generate-btn' onClick={this.generateLink}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                  </svg>
                  <span>Generate Link</span>
                </button>
              </div>
            </div>
          </div>
          <div className='re-col-md-6 right-col'>
            <div id='flex-header-right'>
              <h1 style={{marginLeft: "15px", fontSize: "30px"}}>Preview Look Link</h1>
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
          </div>
        </div>

        <div className='dashboard'>
          <div className='text-center full-height'>
            {/* <MDBBtn id='create-btn' className='m-4 btn-rounded'>
              <MDBIcon icon="plus" className='px-1'/>
              Create New
            </MDBBtn> */}
            <button className="dashboard-btn rounded -ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                id='create-btn'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="white">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>    
              <span style={{ color:'white' }}>Create New</span>
            </button>
          </div>
          <div className='re-row'>
            {this.state.card.map((item, index) =>
              <div className='re-col-md-4' key={index} className='previewCard'>
                {item}
                <div className='text-center'>
                  {/* <MDBBtn className='card-btn btn-rounded' onClick={() => {this.copyLink(index)}}>
                    <MDBIcon far icon="copy" className='px-1'/>
                    Copy Link
                  </MDBBtn> */}
                  <button className="dashboard-btn card-btn rounded -ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      id='create-btn' onClick={() => {this.copyLink(index)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="white">
                      <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                      <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                    </svg>
                    <span style={{ color:'white', marginLeft:'4px' }}>Copy Link</span>
                  </button>
                  {/* <MDBBtn className='card-btn btn-rounded' onClick={() => {this.removeLink(index)}}>
                    <MDBIcon far icon='trash-alt' className='px-1'/>
                    Delete Link
                  </MDBBtn> */}
                  <button className="dashboard-btn card-btn rounded -ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      id='create-btn' onClick={() => {this.removeLink(index)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="white">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    <span style={{ color:'white', marginLeft:'4px' }}>Delete Link</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
      </>  
    );
  }
}

export default App;
