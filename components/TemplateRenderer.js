import { FramedDocumentRenderer } from '@govtechsg/decentralized-renderer-react-components';
import { createElement, useEffect, useState } from 'react';
import { framedRendererRegistry } from '../lib/registry.js';
import ValidityMessage from './ValidityMessage.js'
import ky from 'ky';

function rendererProxy(component) {
  if (!component) return;
  return (props) => (<>
    <WrappedDocumentValidation {...props} />
    {createElement(component, props)}
  </>);
}

function WrappedDocumentValidation({ wrappedDocument }) {

  const [message, setMessage] = useState("");

  useEffect(() => {

    (async function () {
      try {
        const url = process.env.NEXT_PUBLIC_CHECK_DOCUMENT_URL;

        // ignore if url is not specified in the env
        if (!url) {
          return;
        }

        // do not request if wrappedDocument is nullish
        if (typeof wrappedDocument !== 'object') {
          return;
        }

        const response = await ky.post(url, { json: wrappedDocument }).json();

        // the message only visibile if it's invalid
        if (!response.valid && typeof response.message === 'string') {
          setMessage(response.message);
        }

      } catch (e) {
        console.error(e)
      }
    })();

  }, [])

  if (!message) return;
  return <ValidityMessage>Document has been expired</ValidityMessage>; // message will need to discussed on the dynamic
}


/**
 * All templates will be wrapped with a renderer proxy to show a validity message on top message
 */
const templateRegistry = Object.fromEntries(
  Object.entries(framedRendererRegistry)
    .map(([key, values]) => {
      return [key, values.map(value => ({
        ...value,
        template: rendererProxy(value.template), // wrap the template with a proxied one.
      }))];
    })
)


export default function TemplateRenderer() {
  return (
    <>
      <FramedDocumentRenderer templateRegistry={templateRegistry} />
    </>
  );
}

