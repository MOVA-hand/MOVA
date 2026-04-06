\subsection{Feature-on-Mesh Representation}
\label{sec:fom}
Through multimodal reasoning, we obtain fused point features associated with the MANO-HD template, which encode both image appearance and hand geometry.
Existing approaches \cite{lhm,wu2025sings} typically rely on vertex-based features as the carrier for Gaussian decoding, implicitly assuming that vertex-level representations provide a sufficient carrier for both appearance and deformation.
However, this assumption becomes insufficient for highly articulated hands, where non-rigid deformation often manifests as surface stretching and shearing within mesh faces rather than only localized at vertices.
As a result, Gaussians decoded solely from vertex-wise features may not adapt their shape to face-interior deformation, limiting pose-dependent appearance fidelity. %Without geometric constraints to adapt Gaussians' shape to local surface deformation, vertex-based representations show limited ability to model pose-dependent hand appearance. 
To address this representation-level limitation, we further introduce a FoM representation as a face-level carrier for Gaussian decoding.
Instead of replacing the fused point features, FoM complements them by defining features on mesh faces, providing a face-level representation that better reflects local surface changes under non-rigid deformation.


For each mesh triangle $t_i$ with vertices $\{v_{i,1}, v_{i,2}, v_{i,3} \}$, we introduce a set of learnable barycentric coordinate $(u_i^F, v_i^F)$, normalized through a softmax to ensure a valid convex combination, to interpolate vertex-wise features within each face, yielding a face-level representation.
Unlike a fixed rule such as the triangle centroid, the learnable approach enables the model to adaptively determine informative face-level embedding features. % a more expressive face-level embedding for subsequent Gaussian decoding. % 
Given the vertex-wise latent features $\{ \mathbf{F}_{i,1}, \mathbf{F}_{i,2}, \mathbf{F}_{i,3} \}$ obtained from the occlusion-aware Gaussian features, we compute the face-level feature as a barycentric interpolation of the corresponding vertex features:
\begin{equation}
\mathbf{F}^{\text{FoM}}_i
=u_i^F \ast\mathbf{F}_{i,1} + v_i^F \ast\mathbf{F}_{i,2} + (1-u_i^F-v_i^F) \ast \mathbf{F}_{i,3}.
\end{equation}
This operation lifts vertex-wise features onto mesh faces, yielding a dense set of face-embedded Gaussian features that constitute the FoM representation.
Each face-level feature is then decoded into Gaussian attributes, including opacity, color, scaling, rotation, and a set of barycentric coordinates $(u_i^G, v_i^G)$ used to determine the Gaussian position within the corresponding triangle. 
This design explicitly ties Gaussians to the mesh surface so that they can vary consistently with mesh deformation during animation.
During pose deformation, we first apply LBS to the MANO-HD mesh vertices to obtain posed vertex positions. 
Gaussian positions are then updated by barycentric interpolation of the posed triangle vertices, ensuring that Gaussian positions follow the surface deformation of the mesh.
More importantly, we further drive Gaussian shape adaptation using mesh-derived geometric deformation. 
Specifically, we adopt a mesh-embedded Gaussian deformation scheme inspired by \cite{splattingavatar} to estimate per-vertex local rotations by area-weighted averaging over adjacent triangles, and interpolate them within each face to obtain a face-level rotation \textcolor{green}{(more details are shown in appendix)}. 
This explicitly couples surface stretching and shearing to Gaussian deformation, which cannot be captured by vertex-based deformation alone.
By embedding latent features on mesh faces and deforming Gaussians in a mesh-driven manner, the proposed FoM representation provides a pose-dependent mechanism for Gaussian deformation under severe hand articulation, enabling more consistent appearance modeling in regions undergoing strong non-rigid surface deformation.
