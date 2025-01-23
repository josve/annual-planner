"use client";

import React, { useState } from "react";
import { BottomNavigation, BottomNavigationAction, Menu, MenuItem, IconButton } from "@mui/material";
import Paper from '@mui/material/Paper';
import Link from "next/link";
import { Session } from 'next-auth';
import {getMenuItems} from "@/lib/menu";
import MenuIcon from '@mui/icons-material/Menu';

interface Props {
    readonly session: Session;
}

export default function FooterClient({ session }: Props) {
    const [value, setValue] = React.useState(0);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const menuItems = getMenuItems(session);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Paper sx={{
            display: {xs: "block", md: "none"},
            paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))",
            zIndex: "9000",
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0
        }} elevation={3}>
            <BottomNavigation
                showLabels
                value={value}
                onChange={(ignore, newValue: number) => {
                    setValue(newValue);
                }}
                className="footer"
            >
                {menuItems.slice(0, 4).map((menuItem) => (
                    <BottomNavigationAction
                        key={menuItem.url}
                        label={menuItem.name}
                        icon={<menuItem.icon/>}
                        component={Link}
                        href={menuItem.url}
                    />
                ))}
                {menuItems.length > 4 && (
                    <BottomNavigationAction
                        label="Mer"
                        icon={<MenuIcon/>}
                        onClick={handleClick}
                    />
                )}
            </BottomNavigation>
            {menuItems.length > 4 && (
                <>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                    >
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
        </Paper>
    );
}
