import networkx as nx
import matplotlib.pyplot as plt

G = nx.Graph()
G.add_edges_from([(1, 2), (3,5),(2, 3), (3, 4)])
nx.draw(G, with_labels=True)
plt.savefig("graph.png")