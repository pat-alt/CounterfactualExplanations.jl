"""
    build_model()

Helper function to build simple MLP.

# Examples

```julia-repl
using BayesLaplace
nn = build_model()
```

"""
function build_model(;input_dim=2,n_hidden=32,output_dim=1,batch_norm=false,dropout=false,activation=Flux.relu)
    
    if batch_norm
        nn = Chain(
            Dense(input_dim, n_hidden),
            BatchNorm(n_hidden, activation),
            Dense(n_hidden, output_dim),
            BatchNorm(output_dim)
        )  
    elseif dropout
        nn = Chain(
            Dense(input_dim, n_hidden, activation),
            Dropout(0.1),
            Dense(n_hidden, output_dim)
        )  
    else
        nn = Chain(
            Dense(input_dim, n_hidden, activation),
            Dense(n_hidden, output_dim)
        )  
    end

    return nn

end

using Flux
using Flux.Optimise: update!
"""
    forward_nn(nn, loss, data, opt; n_epochs=200, plotting=nothing)

Wrapper function to train neural network and generate an animation showing the training loss evolution.
"""
function forward_nn(nn, loss, data, opt; n_epochs=200, plotting=nothing)

    avg_l = []
    
    for epoch = 1:n_epochs
      for d in data
        gs = Flux.gradient(Flux.params(nn)) do
          l = loss(d...)
        end
        update!(opt, Flux.params(nn), gs)
      end
      if !isnothing(plotting)
        plt = plotting[1]
        anim = plotting[2]
        idx = plotting[3]
        avg_loss(data) = mean(map(d -> loss(d[1],d[2]), data))
        avg_l = vcat(avg_l,avg_loss(data))
        if epoch % plotting[4]==0
          plot!(plt, avg_l, color=idx)
          frame(anim, plt)
        end
      end
    end
    
end

"""
    build_ensemble(K::Int;kw=(input_dim=2,n_hidden=32,output_dim=1))

Helper function to build a simple ensemble composed of `K` MLPs.

# Examples

```julia-repl
using BayesLaplace
𝑬 = build_ensemble(5)
```

"""
function build_ensemble(K=5;kw=(input_dim=2,n_hidden=32,output_dim=1))
    ensemble = [build_model(;kw...) for i in 1:K]
    return ensemble
end

using Statistics
"""
    forward(𝓜, data, opt; loss_type=:logitbinarycrossentropy, plot_loss=true, n_epochs=200, plot_every=20) 

Wrapper function to train deep ensemble and generate an animation showing the training loss evolution.
"""
function forward(𝓜, data, opt; loss_type=:logitbinarycrossentropy, plot_loss=true, n_epochs=10, plot_every=1) 

    anim = nothing
    if plot_loss
        anim = Animation()
        plt = plot(ylim=(0,1), xlim=(0,n_epochs), legend=false, xlab="Epoch", title="Average (training) loss")
        for i in 1:length(𝓜)
            nn = 𝓜[i]
            loss(x, y) = getfield(Flux.Losses,loss_type)(nn(x), y)
            forward_nn(nn, loss, data, opt, n_epochs=n_epochs, plotting=(plt, anim, i, plot_every))
        end
    else
        plt = nothing
        for nn in 𝓜
            loss(x, y) = getfield(Flux.Losses,loss_type)(nn(x), y)
            forward_nn(nn, loss, data, opt, n_epochs=n_epochs, plotting=plt)
        end
    end

    return 𝓜, anim
end;

using BSON: @save
"""
    save_ensemble(𝓜::AbstractArray; root="")

Saves all models in ensemble to disk.
"""
function save_ensemble(𝓜::AbstractArray; root="")
    for i in 1:length(𝓜)
        path = root * "/nn" * string(i) * ".bson"
        model = 𝓜[i]
        @save path model
    end
end

using BSON: @load
"""
    load_ensemble(root="")

Loads all models in `root` folder and stores them in a list.
"""
function load_ensemble(;root="")
    all_files = Base.Filesystem.readdir(root)
    is_bson_file = map(file -> Base.Filesystem.splitext(file)[2][2:end], all_files) .== "bson"
    bson_files = all_files[is_bson_file]
    bson_files = map(file -> root * "/" * file, bson_files)
    𝓜 = []
    for file in bson_files
        @load file model
        𝓜 = vcat(𝓜, model)
    end
    return 𝓜
end

# Plot data points:
using Plots
"""
    plot_data!(plt,X,y)

# Examples

```julia-repl
using CounterfactualExplanations
using CounterfactualExplanations.Data: toy_data_linear
using CounterfactualExplanations.Utils: plot_data!
X, y = toy_data_linear(100)
plt = plot()
plot_data!(plt, hcat(X...)', y)
```

"""
function plot_data!(plt,X,y)
    Plots.scatter!(plt, X[:,1],X[:,2],group=Int.(y),color=Int.(y))
end

# Plot contour of posterior predictive:
using Plots, ..Models
"""
    plot_contour(X,y,𝑴;clegend=true,title="",length_out=50,type=:laplace,zoom=0,xlim=nothing,ylim=nothing)

Generates a contour plot for the posterior predictive surface.  

# Examples

```julia-repl
using CounterfactualExplanations
using CounterfactualExplanations.Data: toy_data_linear
using CounterfactualExplanations.Utils: plot_contour
X, y = toy_data_linear(100)
X = hcat(X...)'
β = [1,1]
𝑴 =(β=β,)
predict(𝑴, X) = σ.(𝑴.β' * X)
plot_contour(X, y, 𝑴)
```

"""
function plot_contour(X,y,𝑴;clegend=true,title="",length_out=50,zoom=-1,xlim=nothing,ylim=nothing,linewidth=0.1)
    
    # Surface range:
    if isnothing(xlim)
        xlim = (minimum(X[:,1]),maximum(X[:,1])).+(zoom,-zoom)
    else
        xlim = xlim .+ (zoom,-zoom)
    end
    if isnothing(ylim)
        ylim = (minimum(X[:,2]),maximum(X[:,2])).+(zoom,-zoom)
    else
        ylim = ylim .+ (zoom,-zoom)
    end
    x_range = collect(range(xlim[1],stop=xlim[2],length=length_out))
    y_range = collect(range(ylim[1],stop=ylim[2],length=length_out))
    Z = [Models.probs(𝑴,[x, y])[1] for x=x_range, y=y_range]

    # Plot:
    plt = contourf(
        x_range, y_range, Z'; 
        colorbar=clegend, title=title, linewidth=linewidth,
        xlim=xlim,
        ylim=ylim
    )
    plot_data!(plt,X,y)

end

# Plot contour of posterior predictive:
using Plots, ..Models
"""
    plot_contour_multi(X,y,𝑴;clegend=true,title="",length_out=50,type=:laplace,zoom=0,xlim=nothing,ylim=nothing)

Generates a contour plot for the posterior predictive surface.  

# Examples

```julia-repl
using BayesLaplace, Plots
import BayesLaplace: predict
using NNlib: σ
X, y = toy_data_linear(100)
X = hcat(X...)'
β = [1,1]
𝑴 =(β=β,)
predict(𝑴, X) = σ.(𝑴.β' * X)
plot_contour(X, y, 𝑴)
```

"""
function plot_contour_multi(X,y,𝑴;title="",length_out=50,zoom=-1,xlim=nothing,ylim=nothing,linewidth=0.1)
    
    # Surface range:
    if isnothing(xlim)
        xlim = (minimum(X[:,1]),maximum(X[:,1])).+(zoom,-zoom)
    else
        xlim = xlim .+ (zoom,-zoom)
    end
    if isnothing(ylim)
        ylim = (minimum(X[:,2]),maximum(X[:,2])).+(zoom,-zoom)
    else
        ylim = ylim .+ (zoom,-zoom)
    end
    x_range = collect(range(xlim[1],stop=xlim[2],length=length_out))
    y_range = collect(range(ylim[1],stop=ylim[2],length=length_out))
    Z = reduce(hcat, [Models.probs(𝑴,[x, y]) for x=x_range, y=y_range])

    # Plot:
    plt = plot()
    plot_data!(plt,X,y)
    out_dim = size(Z)[1]
    for d in 1:out_dim
        contour!(
            plt,
            x_range, y_range, Z[d,:]; 
            colorbar=false, title=title,
            xlim=xlim,
            ylim=ylim,
            colour=d
        )
    end

    return plot(plt)
    
end