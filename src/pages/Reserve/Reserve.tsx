// import React from 'react'
import { UserWrapper } from 'components';
import { Helmet } from 'react-helmet-async';

const Reserve = () => {
  return (
    <>
      <Helmet title='Reserve' />
      <UserWrapper title='Reserve'>
        The quick brown fox jumps over the lazy dog
      </UserWrapper>
    </>
  );
};

export default Reserve;
