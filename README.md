
# CounterfactualExplanations

[![Stable](https://img.shields.io/badge/docs-stable-blue.svg)](https://pat-alt.github.io/CounterfactualExplanations.jl/stable) [![Dev](https://img.shields.io/badge/docs-dev-blue.svg)](https://pat-alt.github.io/CounterfactualExplanations.jl/dev) [![Build Status](https://github.com/pat-alt/CounterfactualExplanations.jl/actions/workflows/CI.yml/badge.svg?branch=main)](https://github.com/pat-alt/CounterfactualExplanations.jl/actions/workflows/CI.yml?query=branch%3Amain) [![Coverage](https://codecov.io/gh/pat-alt/CounterfactualExplanations.jl/branch/main/graph/badge.svg)](https://codecov.io/gh/pat-alt/CounterfactualExplanations.jl)

`CounterfactualExplanations.jl` is a package for generating Counterfactual Explanations (CE) and Algorithmic Recourse (AR) for black-box algorithms. Both CE and AR are related tools for explainable artificial intelligence (XAI). While the package is written purely in Julia, it can be used to explain machine learning algorithms developed and trained in other popular programming languages like Python and R. See below for short introduction and other resources or dive straight into the [docs](https://pat-alt.github.io/CounterfactualExplanations.jl/dev).

## News 📣

**JuliaCon 2022**: This project will be presented at JuliaCon 2022 in July 2022. See here for the preliminary slide pack: [[html](https://www.paltmeyer.com/CounterfactualExplanations.jl/dev/resources/juliacon22/presentation.html#/title-slide)]

## Installation 🚩

The first release of this package is now on [Julia’s General Registry](https://github.com/JuliaRegistries/General) and can be installed as follows:

``` julia
using Pkg
Pkg.add("CounterfactualExplanations")
```

CounterfactualExplanations.jl is currently under active development. To install the development version of the package you can run the following command:

``` julia
using Pkg
Pkg.add(url="https://github.com/pat-alt/CounterfactualExplanations.jl", rev="dev")
```

## Background and motivation

#### The Need for Explainability ⬛

Machine learning models like deep neural networks have become so complex, opaque and underspecified in the data that they are generally considered as black boxes. Nonetheless, such models often play a key role in data-driven decision-making systems. This often creates the following problem: human operators in charge of such systems have to rely on them blindly, while those individuals subject to them generally have no way of challenging an undesirable outcome:

> “You cannot appeal to (algorithms). They do not listen. Nor do they bend.”
>
> — Cathy O’Neil in [*Weapons of Math Destruction*](https://en.wikipedia.org/wiki/Weapons_of_Math_Destruction), 2016

#### Enter: Counterfactual Explanations 🔮

Counterfactual Explanations can help human stakeholders make sense of the systems they develop, use or endure: they explain how inputs into a system need to change for it to produce different decisions. Explainability benefits internal as well as external quality assurance. The figure below, for example, shows various counterfactuals generated through different approaches that all turn the predicted label of some classifier from a 9 into a 4. CEs that involve realistic and actionable changes such as the one on the far right can be used for the purpose of algorithmic recourse.

![Realistic counterfactual explanations for MNIST data: turning a 4 into a 9.](https://raw.githubusercontent.com/pat-alt/CounterfactualExplanations.jl/main/docs/src/examples/image/www/MNIST_9to4.png)

Explanations that involve realistic and actionable changes can be used for the purpose of algorithmic recourse (AR): they offer human stakeholders a way to not only understand the system’s behaviour, but also react to it or adjust it. The figure below illustrates the point of AR through a toy example: it shows the counterfactual path of one sad cat 🐱 that would like to be grouped with her cool dog friends. Unfortunately, based on her tail length and height she was classified as a cat by a black-box classifier. The recourse algorithm perturbs her features in such a way that she ends up crossing the decision boundary into a dense region inside the target class.

![A sad 🐱 on its counterfactual path to its cool dog friends.](https://raw.githubusercontent.com/pat-alt/CounterfactualExplanations.jl/main/docs/src/www/recourse_laplace.gif)

Counterfactual Explanations have certain advantages over related tools for explainable artificial intelligence (XAI) like surrogate eplainers (LIME and SHAP). These include:

-   Full fidelity to the black-box model, since no proxy is involved.
-   No need for (reasonably) interpretable features as opposed to LIME and SHAP.
-   Clear link to Causal Inference and Bayesian Machine Learning.
-   Less susceptible to adversarial attacks than LIME and SHAP.

## Usage example 🔍

Generating counterfactuals will typically look like follows:

``` julia
using CounterfactualExplanations

# Data:
using CounterfactualExplanations.Data
using Random
Random.seed!(1234)
xs, ys = Data.toy_data_linear()
X = hcat(xs...)
counterfactual_data = CounterfactualData(X,ys')

# Model
using CounterfactualExplanations.Models: LogisticModel, probs 
# Logit model:
w = [1.0 1.0] # true coefficients
b = 0
M = LogisticModel(w, [b])

# Randomly selected factual:
x = select_factual(counterfactual_data,rand(1:size(X)[2]))
y = round(probs(M, x)[1])
target = round(probs(M, x)[1])==0 ? 1 : 0 

# Counterfactual search:
generator = GenericGenerator()
```

Running the counterfactual search yields:

``` julia-repl
julia> counterfactual = generate_counterfactual(x, target, counterfactual_data, M, generator)
Factual: x=[-4.950923496639821, -3.1936074559828267], y=0.0, p=[0.0002902345324396253]
Target: target=1, γ=0.75
Counterfactual outcome: x′=[-0.3211366377381628, 1.4361794029188308], y′=1.0, p′=[0.7530680429735285]
Converged: ✅ after 70 steps.
```

## Goals and limitations 🎯

The goal for this library is to contribute to efforts towards trustworthy machine learning in Julia. The Julia language has an edge when it comes to trustworthiness: it is very transparent. Packages like this one are generally written in pure Julia, which makes it easy for users and developers to understand and contribute to open source code. Eventually the aim for this project is to offer a one-stop-shop of counterfactual explanations. We want to deliver a package that is at least at par with the [CARLA](https://github.com/carla-recourse/CARLA) Python library in terms of its functionality. Contrary to CARLA, we aim for languague interoperability. Currently the package falls short of this goal in a number of ways: 1) the number of counterfactual generators is limited, 2) the data preprocessing functionality needs to be extended, 3) it has not yet gone through a formal review.

## Contribute 🛠

Our goal is to provide a go-to place for counterfactual explanations in Julia. To this end, the following is a non-exhaustive list of exciting feature developments we envision:

1.  Additional counterfactual generators and predictive models.
2.  Additional datasets for testing, evaluation and benchmarking.
3.  Improved preprocessing including native support for categorical features.
4.  Support for regression models.

For more details on how to contribute see [here](https://www.paltmeyer.com/CounterfactualExplanations.jl/dev/contributing/).

## Citation 🎓

If you want to use this codebase, please consider citing:

    @software{altmeyer2022CounterfactualExplanations,
      author = {Patrick Altmeyer},
      title = {{CounterfactualExplanations.jl - a Julia package for Counterfactual Explanations and Algorithmic Recourse}},
      url = {https://github.com/pat-alt/CounterfactualExplanations.jl},
      version = {0.1.1},
      year = {2022}
    }
