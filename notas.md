para correr el app hace:
publica http --subdomain=gastos 3000 --oauth google --oauth-allow-email jdlopez13@gmail.com




sudo apt-get install curl
curl -fsSL https://packages.microsoft.com/keys/microsoft.asc | sudo gpg --dearmor -o /usr/share/keyrings/microsoft-prod.gpg
sudo cp /usr/share/keyrings/microsoft-prod.gpg /etc/apt/trusted.gpg.d/
 
curl -fsSL https://packages.microsoft.com/config/ubuntu/22.04/mssql-server-2022.list | sudo tee /etc/apt/sources.list.d/mssql-server-2022.list
 
sudo apt-get update
sudo apt-get install -y mssql-server


# BORRADO DE localhost:3000

<!-- 

<script type="text/javascript">
	
var opcionesSuper1 = []

<% var listaSuper = supermercado.recordset %>
<% listaSuper.forEach(function(el){ %>   

     opcionesSuper1.push('<%=el.cat_especifica%>')   
                
<% }) %>

</script> -->
