import { Avatar, Button, Typography } from '@mui/material'
import React from 'react'
import YouTubeIcon from "@mui/icons-material/YouTube";
import FacebookIcon from "@mui/icons-material/Facebook";

const About = () => {
    const visitFacebook = () => {
      window.location = "https://www.facebook.com/asifaowadud/";
    };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://res.cloudinary.com/dglsw3gml/image/upload/v1679804641/6PP_Ecommerce_Avtars/RC-1280_512_tbl4ei.jpg"
              alt="Founder"
            />
            <Typography>Asif A Owadud</Typography>
            <Button onClick={visitFacebook} color="primary">
              Visit Facebook
            </Button>
            <span>
              This is a sample wesbite made by @asifaowadud. Only with the
              purpose to teach MERN Stack on the channel 6 Pack Project
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Our Brands</Typography>
            <a
              href="https://www.youtube.com/@dodiddad"
              target="blank"
            >
              <YouTubeIcon className="youtubeSvgIcon" />
            </a>

            <a href="https://facebook.com/dodiddad" target="blank">
              <FacebookIcon className="instagramSvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About