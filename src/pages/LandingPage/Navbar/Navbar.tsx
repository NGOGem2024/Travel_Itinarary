
import React, { useState } from "react";
import Logo from "../../../assets/trravelovia.png";
import { HiOutlineBars3 } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";

import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import BookOnlineIcon from "@mui/icons-material/BookOnline";

import styles from "./Navbar.module.css";
import { useNavigate } from "react-router-dom";

interface MenuOption {
  text: string;
  icon: React.ReactNode;
  id: string; // section id
  isButton?: boolean;
}

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -80; // Adjust for fixed navbar height
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const menuOptions: MenuOption[] = [
    { text: "Home", icon: <HomeIcon />, id: "home" },
    { text: "About", icon: <InfoIcon />, id: "about" },
    { text: "Tours", icon: <CommentRoundedIcon />, id: "gallery" },
    { text: "Contact", icon: <PhoneRoundedIcon />, id: "contact" },
    { 
      text: "Book Now", 
      icon: <BookOnlineIcon />, 
      id: "book-now",
      isButton: true 
    },
  ];

  const handleMenuItemClick = (item: MenuOption) => {
    if (item.isButton) {
      navigate("/travelform");
    } else {
      scrollToSection(item.id);
    }
    setOpenMenu(false);
  };

  return (
    <nav className={styles.nav}>
      <div className={styles["nav-logo-container"]}>
        <img 
          src={Logo} 
          alt="Travelovia Logo" 
          onClick={() => scrollToSection("home")}
        />
      </div>

      {/* DESKTOP NAV */}
      <div className={styles["navbar-links-container"]}>
        <a onClick={() => scrollToSection("home")}>Home</a>
        <a onClick={() => scrollToSection("about")}>About</a>
        <a onClick={() => scrollToSection("gallery")}>Tours</a>
        <a onClick={() => scrollToSection("contact")}>Contact</a>

        <button 
          className={styles["primary-button"]}
          onClick={() => navigate("/travelform")}
        >
          Book Now
        </button>
      </div>

      {/* MOBILE MENU BURGER */}
      <div className={styles["navbar-menu-container"]}>
        <HiOutlineBars3 
          onClick={() => setOpenMenu(true)} 
          className={styles.menuIcon}
        />
      </div>

      {/* MOBILE DRAWER */}
      <Drawer 
        open={openMenu} 
        onClose={() => setOpenMenu(false)} 
        anchor="right"
        sx={{
          '& .MuiDrawer-paper': {
            backgroundColor: '#ffffff',
            boxShadow: '-5px 0 25px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <Box sx={{ width: 300, height: '100%' }} role="presentation">
          {/* Close Button Header */}
          <div className={styles.drawerHeader}>
            <div className={styles.drawerLogoContainer}>
              <img src={Logo} alt="Travelovia Logo" width="140" />
            </div>
            <IoClose 
              onClick={() => setOpenMenu(false)} 
              className={styles.closeIcon}
            />
          </div>

          <Divider sx={{ margin: '0 0 1rem 0' }} />

          <List sx={{ padding: '0 1rem' }}>
            {menuOptions.map((item) => (
              <React.Fragment key={item.text}>
                {item.isButton ? (
                  <ListItem 
                    disablePadding 
                    sx={{ 
                      margin: "1.5rem 0",
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  >
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleMenuItemClick(item)}
                      sx={{
                        padding: "1rem 1.5rem",
                        borderRadius: "50px",
                        backgroundColor: "#fe9e0d",
                        fontWeight: "700",
                        fontSize: "1.1rem",
                        textTransform: 'none',
                        boxShadow: '0 4px 15px rgba(254, 158, 13, 0.3)',
                        "&:hover": {
                          backgroundColor: "#e48f0f",
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 20px rgba(254, 158, 13, 0.4)",
                        },
                      }}
                      startIcon={item.icon}
                    >
                      {item.text}
                    </Button>
                  </ListItem>
                ) : (
                  <ListItem disablePadding sx={{ marginBottom: '0.5rem' }}>
                    <ListItemButton
                      onClick={() => handleMenuItemClick(item)}
                      sx={{
                        padding: "1rem 1.5rem",
                        borderRadius: "12px",
                        "&:hover": {
                          backgroundColor: "rgba(254, 158, 13, 0.1)",
                        },
                      }}
                    >
                      <ListItemIcon sx={{ 
                        color: "#fe9e0d",
                        minWidth: '45px'
                      }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.text} 
                        primaryTypographyProps={{
                          fontSize: "1.2rem",
                          fontWeight: "600",
                          color: '#333',
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                )}
              </React.Fragment>
            ))}
          </List>

          <Divider sx={{ margin: "2rem 1rem 1rem" }} />
          
          {/* Contact Info Section */}
          <Box sx={{ padding: "0 1.5rem", textAlign: "center" }}>
            <p className={styles.contactLabel}>
              Need help? Call us:
            </p>
            <p className={styles.contactNumber}>
              +1 (234) 567-8900
            </p>
            <p className={styles.contactHours}>
              Mon-Sun: 8:00 AM - 10:00 PM
            </p>
          </Box>

          {/* Social Links (Optional) */}
          <div className={styles.socialLinks}>
            <a href="#" className={styles.socialLink}>Facebook</a>
            <a href="#" className={styles.socialLink}>Instagram</a>
            <a href="#" className={styles.socialLink}>Twitter</a>
          </div>
        </Box>
      </Drawer>
    </nav>
  );
};

export default Navbar;