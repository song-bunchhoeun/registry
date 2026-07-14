import { wrapDocument, utils } from '@govtechsg/open-attestation';
import { getData } from '@govtechsg/open-attestation';
import { useCallback, useEffect, useState } from 'react'
import styles from '../styles/editor.module.css'
import dynamic from 'next/dynamic.js';
import { json } from '@codemirror/lang-json';
import LoadingSpinner from '../components/LoadingSpinner.js'
import { githubDark } from '@uiw/codemirror-theme-github'
import { framedRendererRegistry } from '../lib/registry.js'
import AutoScaleImage from '../components/AutoScaleImage.js';
import JSON5 from 'json5';
import React from 'react';


const CodeMirror = dynamic(import("@uiw/react-codemirror"), {
  ssr: false,
  loading: () => <LoadingSpinner />
});

export default function Editor() {

  const [currentQRCode, setCurrentQRCode] = useState();
  const [currentWrappedDocument, setCurrentWrappedDocument] = useState()
  const [templates, setTemplates] = useState([])

  const [code, setCode] = useState('');
  const [qrcode, setQRCode] = useState('')


  const wrappedDocument = () => {
    try {
      const result = JSON5.parse(code);
      localStorage.setItem('editor.code', code)
      return result;
    } catch (e) {
      return null;
    }
  }

  useEffect(() => {
    const localCode = localStorage.getItem('editor.code');
    const localQRCode = localStorage.getItem('editor.qrcode');

    if (localCode) setCode(localCode);
    if (localQRCode) setQRCode(localQRCode);

  }, [])

  const onChange = useCallback((value) => setCode(value), []);

  const attach = (doc, qrcode) => {
    setCurrentWrappedDocument(doc);
    setCurrentQRCode(qrcode)
    localStorage.setItem('editor.qrcode', qrcode);

    // find template name
    const templateName = getData(doc).$template.name;
    if (!templateName) return;
    setTemplates(framedRendererRegistry[templateName])

  }

  const render = useCallback(() => {
    const doc = wrappedDocument()
    setCurrentWrappedDocument(null);

    if (!doc) return;
    if (!utils.isWrappedV2Document(doc)) {
      attach(wrapDocument(doc), qrcode);
      return;
    }

    attach(doc, qrcode);
  })

  const format = useCallback(() => {
    const doc = wrappedDocument();
    if (!doc) return;
    setCode(JSON.stringify(doc, null, 2));
  })

  const asData = useCallback(() => {
    const doc = wrappedDocument();
    if (!doc) return;
    if (!utils.isWrappedV2Document(doc)) return;
    setCode(JSON.stringify(getData(doc), null, 2))
  })

  const wrap = useCallback(() => {
    const doc = wrappedDocument();
    if (!doc) return;
    if (utils.isWrappedV2Document(doc)) return;
    setCode(JSON.stringify(wrapDocument(doc), null, 2))
  })


  return <>
    <div className={styles.container}>
      <div className={styles.codemirror_container}>
        <h2 className={styles.headline}>Document Editor</h2>
        <h4>Wrapped Document</h4>
        <CodeMirror
          value={code}
          style={{
            fontSize: 14,
          }}
          placeholder="Enter wrapped document JSON"
          height="640px"
          basicSetup={{ "tabSize": 2, lineNumbers: false }}
          theme={githubDark}
          extensions={[json()]}
          onChange={onChange} />
        <div className={styles.input_wrapper}>
          <label className={styles.input_label}>QR Code</label>
          <input
            value={qrcode}
            onChange={e => setQRCode(e.target.value)}
            className={styles.input}
            placeholder='QR Code Content' />
        </div>
        <div className={styles.buttons}>
          <button onClick={render}>Render to Canvas</button>
          <button onClick={format}>Format JSON</button>
          <button onClick={asData}>To Data</button>
          <button onClick={wrap}>To Wrapped Document</button>
        </div>
        {!wrappedDocument() ? <p className={styles.red}>Data is invalid</p> : null}
      </div>
      <div>
        {templates.map(template => (<div className={styles.template_container} key={template.id}>
          <h2 className={styles.template_headline}>
            {template.label}
            <span className={styles.template_id}>{template.id}</span>
          </h2>
          {React.createElement(template.template, {
            wrappedDocument: currentWrappedDocument,
            document: getData(currentWrappedDocument),
            qrcode: currentQRCode
          })}
        </div>))}
      </div>
    </div>

  </>
}