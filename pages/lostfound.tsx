import {React, useState, useEffect} from 'react';
import { UserProvider } from '@auth0/nextjs-auth0';
import Layout from '../lib/hoagie-ui/Layout';
import Footer from '../components/Footer';
import { Strong, InfoSignIcon, Text, Dialog, Heading, Alert, TextInputField, Pane, majorScale, minorScale, Spinner, EnvelopeIcon, ArrowLeftIcon, Button, Paragraph } from 'evergreen-ui'
import Link from 'next/link';
import Head from 'next/head';
import { useUser } from '@auth0/nextjs-auth0';
import MailForm from "../components/MailForm";

export default function LostFound() {
  
return <MailForm success={true} onError={false} onSend={false} errorMessage={false} digestWarn={true}/>
};