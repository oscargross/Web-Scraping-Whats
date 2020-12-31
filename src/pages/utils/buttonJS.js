import React from 'react';
import {  Button, Spinner} from 'react-bootstrap'




const ButtonJS = (props) => (
  <div style={{ textAlign:'center'}}> <Button  variant="primary" onClick={props.onClickFunction} type="submit" disabled={props.loading}>{props.loading ? <> <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true" />Aguarde enquanto as informações são carregadas</>
                : <>{props.text}</>}
              </Button></div>);

export default ButtonJS;