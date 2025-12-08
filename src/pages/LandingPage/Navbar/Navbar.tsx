/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import Logo from "../../../assets/trravelovia.png";
import { HiOutlineBars3 } from "react-icons/hi2";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";


import styles from "./Navbar.module.css";
import {useNavigate} from "react-router-dom"
interface MenuOption {
  text: string;
  icon: React.ReactNode;
  id: string; // section id
}

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const menuOptions: MenuOption[] = [
    { text: "Home", icon: <HomeIcon />, id: "home" },
    { text: "About", icon: <InfoIcon />, id: "about" },
    { text: "Tours", icon: <CommentRoundedIcon />, id: "work" },
    { text: "Contact", icon: <PhoneRoundedIcon />, id: "contact" },
  ];

  return (
    <nav className={styles.nav}>
      <div className={styles["nav-logo-container"]}>
        <img src={Logo} alt="Logo" />
      </div>

      {/* DESKTOP NAV */}
      <div className={styles["navbar-links-container"]}>
        <a onClick={() => scrollToSection("home")}>Home</a>
        <a onClick={() => scrollToSection("about")}>About</a>
        <a onClick={() => scrollToSection("gallery")}>Tours</a>
        <a onClick={() => scrollToSection("contact")}>Contact</a>

        <button className={styles["primary-button"]}onClick={() => navigate("/travelform")}>Book Now</button>
      </div>

      {/* MOBILE MENU BURGER */}
      <div className={styles["navbar-menu-container"]}>
        <HiOutlineBars3 onClick={() => setOpenMenu(true)} />
      </div>

      {/* MOBILE DRAWER */}
      <Drawer open={openMenu} onClose={() => setOpenMenu(false)} anchor="right">
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {menuOptions.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  onClick={() => {
                    scrollToSection(item.id);
                    setOpenMenu(false);
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider />
        </Box>
      </Drawer>
    </nav>
  );
};

export default Navbar;