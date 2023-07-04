const examples = {
  "networkx": {
    "methodName": "networkx.find_cycle",
    "url": "https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.cycles.find_cycle.html",
    "apiDoc": `find_cycle(G, source=None, orientation=None)[source]
Returns a cycle found via depth-first traversal.

The cycle is a list of edges indicating the cyclic path. Orientation of directed edges is controlled by orientation.

Parameters
:
G
graph
A directed/undirected graph/multigraph.

source
node, list of nodes
The node from which the traversal begins. If None, then a source is chosen arbitrarily and repeatedly until all edges from each node in the graph are searched.

orientation
None | ‘original’ | ‘reverse’ | ‘ignore’ (default: None)
For directed graphs and directed multigraphs, edge traversals need not respect the original orientation of the edges. When set to ‘reverse’ every edge is traversed in the reverse direction. When set to ‘ignore’, every edge is treated as undirected. When set to ‘original’, every edge is treated as directed. In all three cases, the yielded edge tuples add a last entry to indicate the direction in which that edge was traversed. If orientation is None, the yielded edge has no direction indicated. The direction is respected, but not reported.

Returns
:
edges
directed edges
A list of directed edges indicating the path taken for the loop. If no cycle is found, then an exception is raised. For graphs, an edge is of the form (u, v) where u and v are the tail and head of the edge as determined by the traversal. For multigraphs, an edge is of the form (u, v, key), where key is the key of the edge. When the graph is directed, then u and v are always in the order of the actual directed edge. If orientation is not None then the edge tuple is extended to include the direction of traversal (‘forward’ or ‘reverse’) on that edge.

Raises
:
NetworkXNoCycle
If no cycle was found.

See also

simple_cycles
Examples

In this example, we construct a DAG and find, in the first call, that there are no directed cycles, and so an exception is raised. In the second call, we ignore edge orientations and find that there is an undirected cycle. Note that the second call finds a directed cycle while effectively traversing an undirected graph, and so, we found an “undirected cycle”. This means that this DAG structure does not form a directed tree (which is also known as a polytree).

G = nx.DiGraph([(0, 1), (0, 2), (1, 2)])
nx.find_cycle(G, orientation="original")
Traceback (most recent call last):
    ...
networkx.exception.NetworkXNoCycle: No cycle found.
list(nx.find_cycle(G, orientation="ignore"))
[(0, 1, 'forward'), (1, 2, 'forward'), (0, 2, 'reverse')]`
  },
  "html": {
    "methodName": "html.escape",
    "url": "https://docs.python.org/3/library/html.html#html.escape",
    "apiDoc": `html.escape(s, quote=True)
Convert the characters &, < and > in string s to HTML-safe sequences. Use this if you need to display text that might contain such characters in HTML. If the optional flag quote is true, the characters (") and (') are also translated; this helps for inclusion in an HTML attribute value delimited by quotes, as in <a href="...">.`
  },
  "decimal": {
    "methodName": "decimal.as_integer_ratio",
    "url": "https://docs.python.org/3/library/decimal.html#decimal.Decimal.as_integer_ratio",
    "apiDoc":`as_integer_ratio()
Return a pair (n, d) of integers that represent the given Decimal instance as a fraction, in lowest terms and with a positive denominator:

>>>
Decimal('-3.14').as_integer_ratio()
(-157, 50)
The conversion is exact. Raise OverflowError on infinities and ValueError on NaNs.`
  },
  "datetime": {
    "methodName": "datetime.timedelta.total_seconds",
    "url": "https://docs.python.org/3/library/datetime.html#datetime.timedelta.total_seconds",
    "apiDoc": `timedelta.total_seconds()
Return the total number of seconds contained in the duration. Equivalent to td / timedelta(seconds=1). For interval units other than seconds, use the division form directly (e.g. td / timedelta(microseconds=1)).

Note that for very large time intervals (greater than 270 years on most platforms) this method will lose microsecond accuracy.

New in version 3.2.`
}
};

export default examples;
