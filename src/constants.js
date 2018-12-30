export const BODY = {
  delete:  {request: false, response: true},
  get:     {request: false, response: true},
  head:    {request: false, response: false},
  options: {request: false, response: true},
  patch:   {request: true,  response: true},
  post:    {request: true,  response: true},
  put:     {request: true,  response: true}
};
