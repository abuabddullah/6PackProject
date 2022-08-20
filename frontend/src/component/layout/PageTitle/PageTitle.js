import React from 'react';
import Helmet from 'react-helmet';

const PageTitle = ({title}) => {
    return (
        <Helmet>
            <title>{title} - 6PP</title>
        </Helmet>
    );
};

export default PageTitle;