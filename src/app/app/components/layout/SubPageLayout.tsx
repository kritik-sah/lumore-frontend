import React from "react";
import GoBack from "../headers/GoBack";



const SubPageLayout = ({ children, title }: { children: React.ReactNode, title: string }) => {
    return (
        <>
            <GoBack title={title} />
            {children}

        </>
    );
};

export default SubPageLayout;
