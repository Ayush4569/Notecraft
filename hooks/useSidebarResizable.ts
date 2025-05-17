import React, { useCallback, useEffect, useRef, useState } from "react"
import { useAppDispatch } from "@/hooks/redux-hooks";
import { useMediaQuery } from "usehooks-ts";
import { setSidebarState } from "@/redux/slices/sidebar";
export const useSideBarResizable = () => {
    const sidebarRef = useRef<HTMLElement>(null)
    const navbarRef = useRef<HTMLDivElement>(null)
    const isResizingRef = useRef<boolean>(false);
    const [isResetting, setIsResetting] = useState<boolean>(false);
    const dispatch = useAppDispatch()
    const isMobile = useMediaQuery("(max-width:768px)");


    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isResizingRef.current) return;
        let variableWidth = e.clientX;
        variableWidth = Math.max(240, Math.min(variableWidth, 480));

        if (navbarRef.current && sidebarRef.current) {
            sidebarRef.current.style.width = `${variableWidth}px`
            navbarRef.current.style.left = `${variableWidth}px`
            navbarRef.current.style.width = `calc (100% - ${variableWidth}px)`
        }
    }, [])
    const handleMouseUp = useCallback(() => {
        isResizingRef.current = false;
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("mouseup", handleMouseUp)
    }, [handleMouseMove])

    const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        e.preventDefault();

        isResizingRef.current = true;
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }, [handleMouseMove, handleMouseUp])

    const collapseSidebar = useCallback(() => {
        dispatch(setSidebarState(false));
        setIsResetting(true);

        if (sidebarRef.current && navbarRef.current) {
            sidebarRef.current.style.width = "0";
            navbarRef.current.style.left = "0";
            navbarRef.current.style.width = "100%";
        }

        const timer = setTimeout(() => setIsResetting(false), 300);
        return () => clearTimeout(timer);
    }, [dispatch]);

    const resetSidebar = useCallback(() => {
        dispatch(setSidebarState(true));
        setIsResetting(true);

        if (sidebarRef.current && navbarRef.current) {
            sidebarRef.current.style.width = isMobile ? "100%" : `240px`;
            navbarRef.current.style.width = isMobile ? "0" : `calc(100% - 240px)`;
            navbarRef.current.style.left = isMobile ? "100%" : `240px`;
        }

        const timer = setTimeout(() => setIsResetting(false), 300);
        return () => clearTimeout(timer);
    }, [dispatch, isMobile]);

    useEffect(() => {
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);


    return {
        sidebarRef,
        navbarRef,
        onMouseDown,
        collapseSidebar,
        resetSidebar,
        isResetting,
        isMobile
    }
}