import csv
import os

def gerar_sumario():
    caminho_csv = input("digite o nome/caminho do arquivo CSV exportado: ")
    
    if not os.path.exists(caminho_csv):
        print(f"Erro: O arquivo '{caminho_csv}' nao foi encontrado")
        return
        
    horasportech = {}
    totalhorasgeral = 0
    
    try:
        with open(caminho_csv, mode="r", encoding='utf-8') as arquivo:
            leitor = csv.DictReader(arquivo)
            
            for linha in leitor:
                tech = linha['tech'].upper().strip()
                try:
                    horas = float(linha['hours'])
                except ValueError:
                    horas = 0.0
                    
                    
                    if tech not in horasportech:
                        horasportech[tech] = 0.0
                    
                horasportech[tech] += horas
                totalhorasgeral += horas
                    
        print("\n" + "="*35)
        print("📊 SUMÁRIO DE HORAS POR TECNOLOGIA")
        print("="*35)
        
        for tech, horas in horasportech.items():
            print(f"• {tech}: {horas:.1f}h")
            
        print("-" * 35)
        print(f"TOTAL GERAL: {totalhorasgeral:.1f}h")
        print("="*35 + "\n")

    except Exception as e:
        print(f"❌ Erro ao ler o arquivo: {e}")

if __name__ == "__main__":
    gerar_sumario()