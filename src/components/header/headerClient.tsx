"use client";

import Image from "next/image";
import Link from "next/link";
import {
    AppBar,
    Toolbar,
    Box,
    Menu,
    MenuItem,
    IconButton,
    Avatar,
} from "@mui/material";
import { Session } from "next-auth";
import React, { useState } from "react";
import { getMenuItems } from "@/lib/menu";
import MenuIcon from '@mui/icons-material/Menu';

interface Props {
    readonly session: Session;
    readonly avatarUrl: string | null;
}

export default function HeaderClient({ session, avatarUrl }: Props) {
    const menuItems = getMenuItems(session);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar
            position="fixed"
            className="header-bar"
            sx={{
                zIndex: 10001,
                top: "0",
                left: 0,
                right: 0,
                background: "#5C7E62",
                boxShadow: 0,
            }}
        >
            <Toolbar>
                <Box className="header-bar-box" sx={{display: "flex", alignItems: "center", flexGrow: 1}}>
                    <Link href="/" passHref>
                        <Box sx={{display: "flex", alignItems: "center", cursor: "pointer"}}>
                            <Image
                                src="/logo.png"
                                alt="Årshjul"
                                className="header-logo"
                                width="40"
                                height="48"
                            />
                            <div className="header-title">Årshjul</div>
                        </Box>
                    </Link>
                </Box>
                <Box className="header-links header-text">
                    {menuItems.slice(0, 4).map((menuItem) => (
                        <Link
                            className="header-link"
                            href={menuItem.url}
                            title={menuItem.name}
                            key={menuItem.url}
                            passHref
                        >
                            {menuItem.name}
                        </Link>
                    ))}
                    {menuItems.length > 4 && (
                        <>
                            <IconButton edge="end" aria-label="menu" onClick={handleClick}>
                                <MenuIcon/>
                            </IconButton>
                            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                                {menuItems.slice(4).map((menuItem) => (
                                    <MenuItem
                                        onClick={handleClose}
                                        component={Link}
                                        key={menuItem.url}
                                        href={menuItem.url}
                                    >
                                        {menuItem.name}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </>
                    )}
                </Box>
                <Link href="/profile" passHref>
                    <Avatar
                        alt={session.user.name || "User Avatar"}
                        src={avatarUrl || "/default-avatar.png"}
                        sx={{marginLeft: 2, cursor: "pointer"}}
                    />
                </Link>
            </Toolbar>
        </AppBar>
    );
}