import {ApiRouteRequest} from '../../src/request/ApiRouteRequest';

describe('ApiRouteRequest', () => {
  
  const testAdapter = 'TEST_ADAPTER';

  it('identifiy its generated adapter', () => {
    let req = new ApiRouteRequest(testAdapter,'test');
    expect(req.adapter).toBe(testAdapter);
  });

  it('should return its original url regardles of modifying object url', () => {
    let req = new ApiRouteRequest(testAdapter,'test');
    req.url = "another_test";
    expect(req.originalURL).toBe("test");
  });

  it('should add new proxies when setting it directly', () => {
    let req = new ApiRouteRequest(testAdapter,'test');
    req.appliedProxies = [{
      name : 'test1',
      apply(r) {return r}
    }];
    req.appliedProxies = [
      {
        name : 'test2',
        apply(r){return r}
      }
    ];

    expect(req.appliedProxies.length).toBe(2);
  });

  it('should return false when parameter was not set', () => {
    let req = new ApiRouteRequest(testAdapter,'test');
    expect(req.hasParameter('a')).toBe(false);
  });

  it('should return false when parameter was not set in required origin', () => {
    let req = new ApiRouteRequest(testAdapter,'test');

    req.addParameter('a',1,'test');
    req.addParameter('b',2);

    expect(req.hasParameter('a','another')).toBe(false);
    expect(req.hasParameter('a','some')).toBe(false);
    expect(req.hasParameter('b','test')).toBe(false);
    expect(req.hasParameter('b','another')).toBe(false);
  });

  it('should return true when a parameter exists in some origin', () => {
    let req = new ApiRouteRequest(testAdapter,'test');
    req.addParameter('a',1,'test');
    expect(req.hasParameter('a')).toBe(true);
  });

  it('should expose parameter in allParameters when set in any origin', () => {
    let req = new ApiRouteRequest(testAdapter,'test'); 
    req.addParameter('a',1);
    expect(req.parameters['a']).toBe(1);
  });

  it('should show latest added parameter in allParameters when they shadow each other', () => {
    let req = new ApiRouteRequest(testAdapter,'test'); 
    req.addParameter('a',1,'a');
    req.addParameter('a',2,'b');
    expect(req.parameters['a']).toBe(2);
  });

  it('should show go back to last added parameter when a shadowing value is removed', () => {
    let req = new ApiRouteRequest(testAdapter,'test'); 
    req.addParameter('a',1,'a');
    req.addParameter('a',2,'b');
    expect(req.parameters['a']).toBe(2);

    req.removeParameter('a','b');
    expect(req.parameters['a']).toBe(1);

  });

  it('should properly separate params by origin', () => {
    let req = new ApiRouteRequest(testAdapter,'test'); 
    req.addParameter('a',1,'a');
    req.addParameter('b',1,'a');
    req.addParameter('a',2,'b');

    expect(req.parametersByOrigin['a']['a']).toBe(1);
    expect(req.parametersByOrigin['a']['b']).toBe(1);
    expect(req.parametersByOrigin['b']['a']).toBe(2);
  });

  it('should not break when removing a parameter from an empty origin', () => {
    let req = new ApiRouteRequest(testAdapter,'test'); 

    req.removeParameter('a','a');
    req.addParameter('a',1,'a');
    req.removeParameter('a','a');
    expect(req.parameters['a']).toBeUndefined();

    req.addParameter('a',1,'b');
    req.addParameter('a',1,'a');
    req.removeParameter('a','b');
    expect(req.parameters['a']).toBe(1);
    expect(req.getParameter('a')).toBe(req.parameters['a']);
    
  });

  it('should return undefined when param does not exists in any origin', () => {
    let req = new ApiRouteRequest(testAdapter,'test'); 
    expect(req.getParameter('c')).toBeUndefined();
    req.addParameter('c',1);
    expect(req.getParameter('c','a')).toBeUndefined();
    req.addParameter('c',1,'a');
    expect(req.getParameter('c','a')).toBe(1);
    req.removeParameter('c');
    expect(req.getParameter('c','a')).toBe(1);
  });
});