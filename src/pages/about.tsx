import { ReactElement } from 'react';

import Link from 'next/link';

import FlowerContainer from '@/assets/containers/flower.svg';
import EmailIcon from '@/assets/icons/email.svg';
import GithubIcon from '@/assets/icons/github.svg';
import LinkedinIcon from '@/assets/icons/linkedin.svg';
import NavigationDrawer from '@/components/organisms/NavigationDrawer';
import { Meta } from '@/layout/Meta';
import { Main } from '@/templates/Main';

const Contact = () => {
  return (
    <Main
      meta={<Meta title="About" description="OwO" />}
      toggleFixed
    >
      <div className="flex-1 flex items-center justify-center flex-col">
        <div className="w-64 h-64 relative my-5">
          <img
            src={FlowerContainer.src}
            alt=""
            className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full"
          />
          <h1 className="text-3xl font-medium text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            EREN LA GAVIOTA
          </h1>
        </div>
        <h2 className="block text-center w-80 my-5">
          Berrospi, Luis <br />
          Huby, Jose <br />
          Rubio, Ignacio <br />
          Rios, Mario
        </h2>
      </div>
    </Main>
  );
};

Contact.getLayout = (page: ReactElement) => {
  return <NavigationDrawer labelActive="CONTACT_ME">{page}</NavigationDrawer>;
};

export default Contact;
