var documenterSearchIndex = {"docs":
[{"location":"reference/","page":"Reference","title":"Reference","text":"CurrentModule = AlgorithmicRecourse ","category":"page"},{"location":"reference/#AlgorithmicRecourse","page":"Reference","title":"AlgorithmicRecourse","text":"","category":"section"},{"location":"reference/","page":"Reference","title":"Reference","text":"","category":"page"},{"location":"reference/","page":"Reference","title":"Reference","text":"Modules = [AlgorithmicRecourse]","category":"page"},{"location":"tutorials/loss/#Loss-functions-and-gradients-in-algorithmic-recourse","page":"Loss functions and gradients","title":"Loss functions and gradients in algorithmic recourse","text":"","category":"section"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"This is a short tutorial on gradients typically involved in optimization problems of algorithmic recourse.","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"using Zygote\nusing Plots\nusing PlotThemes\ntheme(:juno)\nusing LinearAlgebra","category":"page"},{"location":"tutorials/loss/#General-setup","page":"Loss functions and gradients","title":"General setup","text":"","category":"section"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"Let tin01 denote the target label, fin01 the predicted label and xinmathbbR^D the vector of counterfactual features. Then the differentiable optimization problem in algorithmic recourse is generally of the following form","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"$","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"x' = \\arg \\min_{x'} \\max _{\\lambda} \\lambda \\ell(f(x'),t) + h(x') $","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"where ell denotes some loss function targeting the deviation between the target label and the predicted label and h(cdot) as a complexity penality generally addressing the realism or cost of the proposed counterfactual. ","category":"page"},{"location":"tutorials/loss/#Loss-function-\\ell","page":"Loss functions and gradients","title":"Loss function ell","text":"","category":"section"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"Different choices for ell come to mind, each potentially leading to very different counterfactual outcomes. In practice, ell is typically implemented with respect to the logits a=mathbfw^Tx rather than the probabilities p(y=1x)=sigma(a) predicted by the classifier . We follow this convention here. Common choices for ell in the literature have included Hinge loss, cross-entropy (or log) loss or mean squared error loss (MSE). We shall look at these in some more details here.","category":"page"},{"location":"tutorials/loss/#Hinge-loss","page":"Loss functions and gradients","title":"Hinge loss","text":"","category":"section"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"With respect to the logits a=mathbfwx Hinge loss can be defined as follows","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"$","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"\\ell(a,t)=(t-a)_+=\\max{0,t-a} $","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"where t is the target class in as before (we have tin01 for a binary classification problem).","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"NOTE: Hinge loss is generally defined for the target domain -11. Therefore in our context we have a=z mathbfw^Tx where ","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"$","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"\\begin{aligned} z&=\\begin{cases} -1 && \\text{if} && f=0 \\ f && \\text{if} && f=1 \\end{cases} \\end{aligned} $","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"The first-order derivative of Hinge loss with respect to the logits a is simply","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"$","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"\\begin{aligned} \\ell'(a,t)&=\\begin{cases} -1 && \\text{if} && a<=1 \\ 0 && \\text{otherwise.}  \\end{cases} \\end{aligned} $","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"In the context of counterfactual search the gradient with respect to the feature vector is as follows:","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"$","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"\\begin{aligned} && \\nabla_{x'} \\ell(a,t)&= \\begin{cases} -z\\mathbf{w} && \\text{if} && z\\mathbf{w}^Tx'<=1 \\ 0 && \\text{otherwise.}  \\end{cases} \\end{aligned} $","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"In practice gradients are commonly computed through autodifferentiation. In this tutorial we use the Zygote.jl package which is at the core of Flux.jl, the main deep learning package for Julia.","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"The side-by-side plot below visualises the loss function and its derivative. The plot further below serves as a simple sanity check to verify that autodifferentiation indeed yields the same result as the closed-form solution for the gradient.","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"hinge(a,t) = max(0,t-a)","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"hinge (generic function with 1 method)","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"a = -2:0.1:2\np1 = plot(a, [hinge(a,1) for a=a], title=\"Loss\")\np2 = plot(a, [gradient(hinge,a,1)[1] for a=a], title=\"Gradient\")\nplot(p1, p2, layout = (1, 2), legend = false)","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"┌ Info: Precompiling GR_jll [d2c73de3-f751-5644-a686-071e5b155ba9]\n└ @ Base loading.jl:1342","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"(Image: svg)","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"# Just verifying that the formula for the gradient above indeed yields the same result.\nfunction gradient_man(x,w,y)\n    𝐠 = ifelse(w'x<=1, -w, 0)\n    return 𝐠\nend;\nplot(a, [gradient_man(a,1,1) for a=a], legend=:bottomright, label=\"Manual\", title=\"Gradient\")\nscatter!(a, [gradient(hinge,a,1)[1] for a=a], label=\"Autodiff\")","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"(Image: svg)","category":"page"},{"location":"tutorials/loss/#Cross-entropy-loss-(binary)","page":"Loss functions and gradients","title":"Cross-entropy loss (binary)","text":"","category":"section"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"Binary cross-entropy loss or log loss is typically defined as follows:","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"$","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"\\begin{aligned} && \\ell(a,t)&=- \\left( t \\cdot \\log(\\sigma(a)) + (1-t) \\cdot \\log (1-\\sigma(a)) \\right) \\\n\\end{aligned} $","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"where sigma(a) is the logit function.","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"Once again for the purpose of counter factual search we are interested in the first-order derivative with respect to our feature vector x. You can verify that the partial derivative with respect to feature x_d is as follows:","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"$","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"\\begin{aligned} && \\frac{\\partial \\ell(a,t)}{\\partial x'd}&= (\\sigma(a) - t) wd \\\n\\end{aligned} $","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"The gradient just corresponds to the stacked vector of partial derivatives:","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"$","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"\\begin{aligned} && \\nabla_{x'} \\ell(a,t)&= (\\sigma(a) - t) \\mathbf{w} \\\n\\end{aligned} $","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"As before implementation below is done through autodifferentiation. As before the side-by-side plot shows the resulting loss function and its gradient and the plot further below is a simple sanity check.","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"# logit function:\nfunction 𝛔(a)\n    trunc = 8.0 # truncation to avoid numerical over/underflow\n    a = clamp.(a,-trunc,trunc)\n    p = exp.(a)\n    p = p ./ (1 .+ p)\n    return p\nend\n\n# Binary crossentropy:\ncrossentropy(a, t) = - (t * log(𝛔(a)) + (1-t) * log(1-𝛔(a)))","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"crossentropy (generic function with 1 method)","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"p1 = plot(a, [crossentropy(a,1) for a=a], title=\"Loss\")\np2 = plot(a, [gradient(crossentropy,a,1)[1] for a=a], title=\"Gradient\")\nplot(p1, p2, layout = (1, 2), legend = false)","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"(Image: svg)","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"# Just verifying that the formula for the gradient above indeed yields the same result.\nfunction gradient_man(x,w,y)\n    𝐠 = (𝛔(w'x) - y) .* w\n    return 𝐠\nend;\nplot(a, [gradient_man(a,1,1) for a=a], legend=:bottomright, label=\"Manual\", title=\"Gradient\")\nscatter!(a, [gradient(crossentropy,a,1)[1] for a=a], label=\"Autodiff\")","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"(Image: svg)","category":"page"},{"location":"tutorials/loss/#Mean-squared-error","page":"Loss functions and gradients","title":"Mean squared error","text":"","category":"section"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"Some authors work with distance-based loss functions instead. Since in general we are interested in providing valid recourse, that is counterfactual explanations that indeed lead to the desired label switch, using one of the margin-based loss functions introduced above seems like a more natural choice. Nonetheless, we shall briefly introduce one of the common distance-based loss functions as well. ","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"The mean squared error for counterfactual search implemented with respect to the logits is simply the squared ell 2 distance between the target label and a=mathbfw^Tx:","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"$","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"\\begin{aligned} && \\ell(a,t)&= ||t-a||^2 \\end{aligned} $","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"The gradient with respect to the vector of features is then:","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"$","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"\\begin{aligned} && \\nabla_{x'} \\ell(a,t)&= 2(a - t) \\mathbf{w} \\\n\\end{aligned} $","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"As before implementation and visualizations follow below.","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"mse(a,t) = norm(t - a)^2","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"mse (generic function with 1 method)","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"p1 = plot(a, [mse(a,1) for a=a], title=\"Loss\")\np2 = plot(a, [gradient(mse,a,1)[1] for a=a], title=\"Gradient\")\nplot(p1, p2, layout = (1, 2), legend = false)","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"(Image: svg)","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"# Just verifying that the formula for the gradient above indeed yields the same result.\nfunction gradient_man(x,w,y)\n    𝐠 = 2*(w'x - y) .* w\n    return 𝐠\nend;\nplot(a, [gradient_man(a,1,1) for a=a], legend=:bottomright, label=\"Manual\", title=\"Gradient\")\nscatter!(a, [gradient(mse,a,1)[1] for a=a], label=\"Autodiff\")","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"(Image: svg)","category":"page"},{"location":"tutorials/loss/#Example-in-2D","page":"Loss functions and gradients","title":"Example in 2D","text":"","category":"section"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"To understand the properties of the different loss functions we will now look at a tow example in 2D. The code below generates some random features and assigns labels based on a fixed vector of coefficients using the sigmoid function.","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"# Some random data:\nusing Flux\nusing Random\nRandom.seed!(1234);\nN = 25\nw = reshape([1.0,-2.0],2,1) # true coefficients\nb = 0\nX = reshape(randn(2*N),N,2) # random features\ny = Int.(round.(Flux.σ.(X*w .+ b))); # label based on sigmoid","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"┌ Info: Precompiling Flux [587475ba-b771-5e3f-ad9e-33799f191a9c]\n└ @ Base loading.jl:1342","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"The plot below shows the samples coloured by label along with the decision boundary. You can think of this as representing the outcome of some automated decision making system. The highlighted sample was chosen to receive algorithmic recourse in the following: we will search for a counterfactual that leads to a label switch.","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"# Plot with random sample chose for recourse\nx_prime = reshape(X[5,:],1,2)\nscatter(X[:,1],X[:,2],legend=false,color=y) # features\nPlots.abline!(-w[1]/w[2],0) # decision boundary\nscatter!([x_prime[1]],[x_prime[2]],color=\"yellow\",markersize=10)","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"(Image: svg)","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"Next we will generating recourse using the AlgorithmicRecourse.jl package.","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"# Generate recourse:\nusing AlgorithmicRecourse\n𝓜 = AlgorithmicRecourse.Models.LogisticModel(w, [b]);\ngenerator = AlgorithmicRecourse.Generators.GenericGenerator(0.1,0.1,1e-5) # here we choose the generic generator\nrecourse = generate_recourse(generator, x_prime, 𝓜, 0.0); # generate recourse","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"┌ Info: Precompiling AlgorithmicRecourse [2f13d31b-18db-44c1-bc43-ebaf2cff0be0]\n└ @ Base loading.jl:1342\n\n\n\n\n\nAlgorithmicRecourse.Generators.GenericGenerator(0.1, 0.1, 1.0e-5)","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"scatter(X[:,1],X[:,2],legend=false,color=y) # features\nPlots.abline!(-w[1]/w[2],0) # decision boundary\nscatter!([x_prime[1]],[x_prime[2]],color=\"yellow\",markersize=10)\nscatter!(recourse.path[:,1], recourse.path[:,2])","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"(Image: svg)","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"[recourse.path[:,1]]","category":"page"},{"location":"tutorials/loss/","page":"Loss functions and gradients","title":"Loss functions and gradients","text":"1-element Vector{Vector{Float64}}:\n [0.8644013132535154, 0.7756078569143855, 0.6965199892217692, 0.6236031192969299, 0.5576876509635852, 0.49906589765446335, 0.4474893517555402, 0.40233009886252613, 0.3627869308575854, 0.32804342551286575  …  -0.16184414930441315, -0.16184474581688937, -0.16184532958585093, -0.1618459008835757, -0.16184645997652264, -0.16184700712545624, -0.1618475425855683, -0.16184806660659695, -0.16184857943294337, -0.1618490813037859]","category":"page"},{"location":"","page":"Home","title":"Home","text":"CurrentModule = AlgorithmicRecourse","category":"page"},{"location":"#AlgorithmicRecourse","page":"Home","title":"AlgorithmicRecourse","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Documentation for AlgorithmicRecourse.jl.","category":"page"},{"location":"","page":"Home","title":"Home","text":"","category":"page"},{"location":"","page":"Home","title":"Home","text":"Modules = [AlgorithmicRecourse]","category":"page"}]
}
