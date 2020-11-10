import { ApiRouteRequest } from '../../src/request/ApiRouteRequest';

describe('ApiRouteRequest', () => {

  const testAdapter = 'TEST_ADAPTER';

  it('identify its generated adapter', () => {
    let req = new ApiRouteRequest(testAdapter, 'test');
    expect(req.adapter).toBe(testAdapter);
  });

  it('should return its original url regardless of modifying object url', () => {
    let req = new ApiRouteRequest(testAdapter, 'test');
    req.url = "another_test";
    expect(req.originalURL).toBe("test");
  });

  it('should add new proxies when setting it directly', () => {
    let req = new ApiRouteRequest(testAdapter, 'test');
    req.appliedProxies = [{
      name: 'test1',
      apply(r) { return r }
    }];
    req.appliedProxies = [
      {
        name: 'test2',
        apply(r) { return r }
      }
    ];

    expect(req.appliedProxies.length).toBe(2);
  });

  it('should return false when parameter was not set', () => {
    let req = new ApiRouteRequest(testAdapter, 'test');
    expect(req.has('a')).toBe(false);
  });

  it('should return false when parameter was not set in required origin', () => {
    let req = new ApiRouteRequest(testAdapter, 'test');

    req.add('a', 1, 'test');
    req.add('b', 2);

    expect(req.has('a', 'another')).toBe(false);
    expect(req.has('a', 'some')).toBe(false);
    expect(req.has('b', 'test')).toBe(false);
    expect(req.has('b', 'another')).toBe(false);
  });

  it('should return true when a parameter exists in some origin', () => {
    let req = new ApiRouteRequest(testAdapter, 'test');
    req.add('a', 1, 'test');
    expect(req.has('a')).toBe(true);
  });

  it('should expose parameter in allParameters when set in any origin', () => {
    let req = new ApiRouteRequest(testAdapter, 'test');
    req.add('a', 1);
    expect(req.parameters['a']).toBe(1);
  });

  it('should show latest added parameter in allParameters when they shadow each other', () => {
    let req = new ApiRouteRequest(testAdapter, 'test');
    req.add('a', 1, 'a');
    req.add('a', 2, 'b');
    expect(req.parameters['a']).toBe(2);
  });

  it('should show go back to last added parameter when a shadowing value is removed', () => {
    let req = new ApiRouteRequest(testAdapter, 'test');
    req.add('a', 1, 'a');
    req.add('a', 2, 'b');
    expect(req.parameters['a']).toBe(2);

    req.remove('a', 'b');
    expect(req.parameters['a']).toBe(1);

  });

  it('should properly separate params by origin', () => {
    let req = new ApiRouteRequest(testAdapter, 'test');
    req.add('a', 1, 'a');
    req.add('b', 1, 'a');
    req.add('a', 2, 'b');

    expect(req.getByOrigin['a']['a']).toBe(1);
    expect(req.getByOrigin['a']['b']).toBe(1);
    expect(req.getByOrigin['b']['a']).toBe(2);
  });

  it('should not break when removing a parameter from an empty origin', () => {
    let req = new ApiRouteRequest(testAdapter, 'test');

    req.remove('a', 'a');
    req.add('a', 1, 'a');
    req.remove('a', 'a');
    expect(req.parameters['a']).toBeUndefined();

    req.add('a', 1, 'b');
    req.add('a', 1, 'a');
    req.remove('a', 'b');
    expect(req.parameters['a']).toBe(1);
    expect(req.get('a')).toBe(req.parameters['a']);

  });

  it('should return undefined when param does not exists in any origin', () => {
    let req = new ApiRouteRequest(testAdapter, 'test');
    expect(req.get('c')).toBeUndefined();
    req.add('c', 1);
    expect(req.get('c', 'a')).toBeUndefined();
    req.add('c', 1, 'a');
    expect(req.get('c', 'a')).toBe(1);
    req.remove('c');
    expect(req.get('c', 'a')).toBe(1);
  });
});